#!/usr/bin/env node

const clone = require('git-clone');
const program = require('commander');
const shell = require('shelljs');
const log4js = require('log4js');
const log = log4js.getLogger();
log.level = 'all';
const path = require('path');
const chalk = require('chalk');
const vfs = require('vinyl-fs');
const fs = require('fs-extra');
const through = require('through2');

program
    .version('1.0.0')
    .description('copy files')
    // copy files from local files
    .option('-c --copy [name]', 'copy a project')
program
    .command('* <from> <to>')
    //copy files from github
    .option('kongmengcli githubcli testcli', 'copy files from githubcli to testcli')
    .action(function (from, to) {
        log.info('start work...');
        if (from && to) {
            let pwd = shell.pwd();
            let gitpath = `https://github.com/adai212/${from}.git`;
            log.info(`download from github: ${gitpath}`)
            log.info(`copy files to path: ${pwd}/${to}`)
            // rewrite
            shell.rm('-rf', `${pwd}/${to}`);
            clone(`${gitpath}`, `${pwd}/${to}`, null, function () {
                shell.rm('-rf', `${pwd}/${to}/.git`)
                log.info('done')
            })
        } else {
            log.error('example: kongmengcli githubcli testcli')
        }
    })
program.parse(process.argv)

if(program.copy){
    try{
        //get project path
        var projectpath = path.resolve(program.copy);
        //get project name
        var projectname = path.basename(projectpath);
        log.info(`start to copy files into ${chalk.green(projectpath)}`);
        //create dir
        fs.ensureDirSync(projectname);
        //get local files
        var cwd = path.join(__dirname, './test-vue');
        //copy local files to project path, except node_modules
        vfs.src(['**/*', '!node_modules/**/*', '!.git/**/*'], {cwd: cwd, dot: true})
            .pipe(through.obj(function(file, enc, callback){
                if(!file.stat.isFile()){
                    return callback();
                }
                log.info('copying file: ' + file.path);
                this.push(file);
                return callback();
            }))
            .pipe(vfs.dest(projectpath))
            .on('end', function(){
                log.info('done');
            })
            .resume();
    }catch(e){
        log.error('example: kongmengcli -c mycli')
    }
    
}
