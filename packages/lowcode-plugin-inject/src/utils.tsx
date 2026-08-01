import * as queryString from 'query-string';
import fetchJsonp from 'fetch-jsonp';
import * as React from 'react';
import { pascal } from 'case';
import { Notification } from '@alifd/next';
import { buildComponents } from '@rchh/lowcode-utils';

const typeMap = {
  vc: ['prototype', 'view'],
  vs: ['setter'],
  vp: ['plugin'],
  ve: ['pane'],
  vu: ['utils'],
  plugin: ['designerPlugin'],
  component: ['meta', 'view'],
};

const queryFlag = '__injectFrom'; // deprecated
const injectTypeFlag = '__injectType'; // deprecated
const injectEnvFlag = '__injectEnv'; // deprecated
const debugFlag = 'debug'; // preferred
const arrayFlag = '__components';
const jsonpFlag = '__injectComponent';
const prototypeKeyFlag = '__prototype';
const injectDeviceFlag = '__device';


window[arrayFlag] = [];
window[jsonpFlag] = function addComponents(component) {
  window[arrayFlag].push(component);
};

let injectServerHost = '127.0.0.1';

const searchParams = new URLSearchParams(window.location.search);
// Whether the inject logic should be enabled

export const needInject = searchParams.get('__injectFrom') // legacy compatibility
  || searchParams.get('__injectType') === 'auto' // legacy compatibility
  || searchParams.has('debug')
  || (window as any).injectConfig;


let urlCache = null;

export function setInjectServerHost(finalInjectServerHost) {
  injectServerHost = finalInjectServerHost;
  console.log('inject server host', injectServerHost);
}

export interface InjectOptions {
  filter?: (url: string) => boolean;
}

// Returns the URLs of the injected resources, in the form ['url1', 'url2']
function getInjectUrls(resourceType, type = 'url', injectOptions?: InjectOptions): Promise<any> {
  const filter = (_urls) => {
    if (injectOptions?.filter) {
      _urls = _urls.filter(url => injectOptions.filter(url));
    }
    if (!resourceType) {
      return type === 'url' ? _urls.map(item => item.url || item) : _urls;
    }
    const filteredUrls = _urls.filter((item) => {
      if (typeof item === 'string') {
        return item.indexOf(`name=@ali/${resourceType}-`) >= 0;
      }
      if (item.type) {
        return typeMap[resourceType].indexOf(item.type) >= 0;
      }
      return false;
    })
    return type === 'url' ? filteredUrls.map(item => item.url || item) : filteredUrls;
  };

  return new Promise((resolve) => {
    if (!urlCache) {
      const urlParams = queryString.parse(window.location.search);
      let urls = urlParams[queryFlag] || [];
      urls = Array.isArray(urls) ? urls : [urls];

      const { type, injects } = window.injectConfig || {};
      if (type === 'auto' || urlParams[injectTypeFlag] === 'auto' || urlParams[debugFlag] !== undefined) {
        fetchJsonp(`http://${injectServerHost}:8899/apis/injectInfo`).then(res => res.json()).then((data) => {
          urls = envFilter(data.content);
          urlCache = urls;
          resolve(filter(urlCache));
        }).catch((err) => {
          urlCache = [];
          resolve([]);
          console.error(err);
        });
      } else if (type === 'custom' && injects) {
        urls = urls.concat(injects);
        urlCache = urls;
        resolve(filter(urlCache));
      } else {
        urlCache = urls;
        resolve(filter(urlCache));
      }
    } else {
      resolve(filter(urlCache));
    }
  });
}

function loadScript(url, callback) {
  const src = ((_url) => {
    const isInFileProtocol = _url.indexOf('//') === 0 && window.location.protocol === 'file:';
    return isInFileProtocol ? `//${_url}` : _url;
  })(url);
  const scriptElement = document.createElement('script');
  scriptElement.crossOrigin = 'anonymous';
  scriptElement.src = src;
  scriptElement.async = true;
  if (callback) {
    scriptElement.onload = () => callback();
    scriptElement.onerror = () => callback(new Error(`Inject ${url} failed`));
  }
  document.body.insertBefore(scriptElement, document.body.firstChild);
}

function promiseLoadScript(url) {
  return new Promise((rs, rj) => {
    loadScript(url, e => (e ? rj(e) : rs({})));
  }).then(
    () => {
      console.info(`%c Injected ${url}`, 'font-weight:bold; font-size: 20px; color: orange;');
    },
    (e) => {
      console.error(e);
    },
  );
}

function loadComponentFromSources(sources) {
  return Promise.all(sources.map(url => promiseLoadScript(url)));
}

// Returns the injected resources, in the form [{name, module, pluginType}]
export async function getInjectedResource(type, injectOptions?: InjectOptions) {
  const urls = await getInjectUrls(type, undefined, injectOptions);
  await loadComponentFromSources(urls);
  return window[arrayFlag].filter((item) => {
    const _item = item.default || item;
    if (!type) {
      return true;
    }
    if (_item.type && typeMap[type].indexOf(_item.type) < 0) {
      return false;
    }
    if (!_item.type && _item.name && _item.name.indexOf(`@ali/${type}-`) < 0) {
      return false;
    }
    return true;
  }).map((item) => {
    const _item = item.default || item;
    _item.module = getModule(_item.module);
    return _item;
  });
}

function getModule(module) {
  if (Array.isArray(module)) {
    return module.map(item => getModule(item));
  }
  return module.default || module;
}

function envFilter(injects) {
  if (!injects) {
    return [];
  }

  const urlParams = queryString.parse(window.location.search);

  // Read the designer/preview environment from window or the URL; if unset, infer it from the presence of VisualEngine on window
  const env = window.injectEnv || urlParams[injectEnvFlag] || (window.VisualEngine || window.LowcodeEditor || window.AliLowCodeEngine ? 'design' : 'preview') || 'design';

  let device = urlParams[injectDeviceFlag] || (window.g_config && window.g_config.device) || (window.pageConfig && window.pageConfig.device) || 'web';
  if (device === 'both') { // Lego supports both platforms; when enabled the device is 'both'
    device = /Mobile/.test(window.navigator.userAgent) ? 'mobile' : 'web';
  }

  let prototypeKey = urlParams[prototypeKeyFlag] || (window.pageConfig
    && window.pageConfig.designerConfigs
    && window.pageConfig.designerConfigs.prototypeKey);
  prototypeKey = prototypeKey === 'default' ? '' : prototypeKey;

  return injects.filter((item) => {
    if (env === 'design') {
      // The designer does not need the component view or utils injected
      if (['utils'].indexOf(item.type) >= 0) {
        return false;
      }
      // Inject the requested prototype
      if (item.type === 'prototype') {
        if (item.subType && item.subType !== prototypeKey) {
          return false;
        }
        if (!item.subType && prototypeKey) {
          // Use the matching prototype.js if one exists, otherwise fall back to the default
          const proto = injects.find(item2 => item2.packageName === item.packageName && item2.type === 'prototype' && item2.subType === prototypeKey);
          if (proto) {
            return false;
          }
        }
      }
    }
    if (env === 'preview') {
      // Preview does not need prototype, plugin, setter or pane injected
      if (['prototype', 'plugin', 'setter', 'pane'].indexOf(item.type) >= 0) {
        return false;
      }
      // Desktop apps do not need to load view.mobile
      if (device === 'web' && item.type === 'view' && item.subType === 'mobile') {
        return false;
      }
      // Mobile apps skip the plain view when a view.mobile exists, otherwise they still load the plain view
      if (device === 'mobile' && item.type === 'view' && item.subType !== 'mobile') {
        // Check whether this component provides a view.mobile
        const viewMobile = injects.find(item2 => item2.packageName === item.packageName && item2.type === 'view' && item2.subType === 'mobile');
        if (viewMobile) {
          return false;
        }
      }
    }
    return true;
  });
}

function getComponentFromUrlItems(items) {
  const map = {};
  items.forEach((item) => {
    const { packageName, type, url, library } = item;
    if (!map[packageName]) {
      map[packageName] = {
        packageName,
      };
    }
    map[packageName][type] = url;
    map[packageName]['library'] = library;
  })
  return map;
}


export async function injectAssets(assets, injectOptions?: InjectOptions) {
  if (!needInject) return assets;
  try {
    const injectUrls = await getInjectUrls('component', 'item', injectOptions);
    const components = getComponentFromUrlItems(injectUrls)
    Object.keys(components).forEach((name) => {
      const item = components[name];
      const pascalCaseName = pascal(name);
      if (!assets.packages) assets.packages = [];
      if (!assets.components) assets.components = [];
      assets.packages.push({
        "package": name,
        "version": '0.1.0',
        "library": item.library || pascalCaseName,
        "urls": [item.view],
        "editUrls": [item.view],
      });
      assets.components.push({
        exportName: `${pascalCaseName}Meta`,
        url: item.meta,
      });
    })
    if (Object.keys(components).length > 0) {
      Notification.success({
        title: 'Successfully injected the following components',
        content: (
          <div>
            {Object.keys(components).map((name) => (
              <p>Component: <b>{name}</b></p>
            ))}
          </div>
        )
      })
    }
  } catch (err) {}
  return assets;
}

export async function injectComponents(components, injectOptions?: InjectOptions) {
  if (!needInject) return components;
  const injectUrls = await getInjectUrls('component', 'item', injectOptions);
  await loadComponentFromSources(injectUrls.map(item => item.url || item));
  const injectedComponents = getComponentFromUrlItems(injectUrls);
  const libraryMap = {};
  const componentsMap = {};
  Object.keys(injectedComponents).forEach((name) => {
    const { library } = injectedComponents[name];
    const pascalName = pascal(name);
    libraryMap[name] = library || pascalName;
    window[`${pascalName}Meta`]?.components?.forEach((item) => {
      componentsMap[item.componentName] = item.npm;
    })
  })
  const injectedComponentsForRenderer = await buildComponents(libraryMap, componentsMap, undefined);
  if (Object.keys(injectedComponents).length > 0) {
    Notification.success({
      title: 'Successfully injected the following components',
      content: (
        <div>
          {Object.keys(injectedComponents).map((name) => (
            <p>Component: <b>{name}</b></p>
          ))}
        </div>
      )
    })
  }
  return { ...components, ...injectedComponentsForRenderer };
}

export async function filterPackages(packages = [], injectOptions?: InjectOptions) {
  if (!needInject) return packages;
  const injectUrls = await getInjectUrls('component', 'item', injectOptions);
  const injectedComponents = getComponentFromUrlItems(injectUrls);
  return packages.filter((item) => {
    return !(item.package in injectedComponents)
  });
}
