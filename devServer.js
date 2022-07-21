import watch from 'watch';
import {exec} from 'node:child_process';

const ignoredFiles = ['dist', 'vite.config.ts.mjs'];

watch.watchTree('./', {
  filter: (path) =>  !ignoredFiles.includes(path)
}, () => {
  exec('yarn run dev', (_, output, err) => {
    if (output) console.log(output);
    if (err) console.log(err);
  });
})