#!/usr/bin/env node
const { program } = require('commander');

const figlet=require("figlet");
const versionStr=figlet.textSync("xx-cli");
const Printer =require('@darkobits/lolcatjs');
const shell = require('shelljs');
const _version=require("../package.json").version;
const chalk=require("chalk");
const inquirer = require('inquirer');
const ora = require('ora');
const download=require("download-git-repo");
program.version(Printer.default.fromString(versionStr+`${_version}`));
program.option("-c,create","初始化项目");
const bindHandler={
	create(otherParmas){
		console.log("初始化项目入口");
		inquirer
		  .prompt([
		    {
				type:'text',
				message:"1.输入文件夹名称",
				name:'dirname'
			},
			{
				type:"list",
				name:'jskind',
				message:"2.选择开发环境",
				choices:['TypeScript','JS']
			}	
			
		  ])
		  .then(answers => {
		    const _pwd=shell.pwd().stdout;
			const projectPath=`${_pwd}/${answers.dirname}`;
			shell.rm("-rf",projectPath);
			shell.mkdir(projectPath);
			const spinner = ora('downloading ...');
			spinner.start();
			const template="direct:git@github.com:wumao016/mobile.git";
			download(template,projectPath,{clone:true}, function (err) {
			 spinner.stop();
			  if(err){
				  console.log(chalk.red("下载失败"))
			  }else{
				  shell.sed("-i","demo2",answers.dirname,projectPath+'/package.json');
			  }
			})
		  })
		
	}
}
program
  .usage("[cmd] <options>")
  .arguments("<cmd> [env]")
  .action(function(cmd,otherParmas){
	  const handler=bindHandler[cmd];
	  if(typeof handler==='undefined'){
		  console.log(chalk.blue(`${cmd}`)+chalk.red("暂未支持"))
	  }else{
		  handler(otherParmas)
		  
	  }
  })
program.parse(process.argv);
