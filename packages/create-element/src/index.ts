#!/usr/bin/env node
import * as inquirer from 'inquirer';
import * as path from 'path';
import initComponent from './component';
import initSetter from './setter';
import initPlugin from './plugin';
import initEditor from './editor';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers'

const getQuestions = ({ argv }) => {
  return [
    {
      type: 'list',
      name: 'componentType',
      message: 'Select the type of engine ecosystem element',
      choices: [
        {
          name: 'Component / Material',
          value: 'component',
        },
        {
          name: 'Setter',
          value: 'setter',
        },
        {
          name: 'Plugin',
          value: 'plugin',
        },
        {
          name: 'Editor',
          value: 'editor',
        },
      ]
    },
    {
      type: 'input',
      name: 'projectName',
      message: 'Package name of the ecosystem element',
      default(ans) {
        const pathBaseName = path.basename(path.join(process.cwd(), argv._[0] || './'));
        return pathBaseName;
      }
    },
    {
      type: 'input',
      name: 'description',
      message: 'Short description of the ecosystem element',
      default(ans) {
        return ans.projectName;
      },
    },
    {
      type: 'input',
      name: 'author',
      message: 'Author name',
      default() {
        return process.env.USER || process.env.USERNAME;
      },
    },
  ];
}

const initMap = {
  component: initComponent,
  setter: initSetter,
  plugin: initPlugin,
  editor: initEditor,
};

const main = async () => {
  const argv = yargs(hideBin(process.argv))
    .options('beta', {
      type: 'boolean',
      describe: 'use beta template package to init',
      default: false,
    })
    .argv;
  const result = await inquirer.prompt(getQuestions({ argv }));
  const initializer = initMap[result.componentType];
  await initializer(result);
}

main();
