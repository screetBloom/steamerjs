/*
 * This plugin is going to kickstart plugin or starterkit development.
 */

const path = require('path');
const git = require('simple-git');
const SteamerPlugin = require('steamer-plugin');

class DevelopPlugin extends SteamerPlugin {
    constructor(args) {
        super(args);
        this.argv = args;
        this.pluginName = 'steamer-plugin-develop';
        this.description = require('./config').descriptions.develop;
        this.config = this.readSteamerDefaultConfig();
        this.pluginPrefix = this.config.PLUGIN_PREFIX;
        this.kitPrefix = this.config.KIT_PREFIX;
        this.teamPrefix = this.config.TEAM_PREFIX;
        this.git = git;
    }

    init() {
        let argv = this.argv;
        let isPlugin = argv.plugin || argv.p || false;
        let isKit = argv.kit || argv.k || false;
        let isTeam = argv.team || argv.t || false;

        if (isPlugin && isPlugin !== false) {
            this.plugin(isPlugin);
        }
        else if (isKit && isKit !== false) {
            this.kit(isKit);
        }
        else if (isTeam && isTeam !== false) {
            this.team(isTeam);
        }
    }

    /**
     * install plugin template
     * @param {String} plugin
     */
    plugin(plugin) {
        let pluginName = `${this.pluginPrefix}${plugin}`;
        let projectPath = path.join(process.cwd(), pluginName);
        let pluginTemplateRepo = 'https://github.com/steamerjs/steamer-plugin-example';

        if (this.fs.existsSync(projectPath)) {
            return this.folderExist(projectPath);
        }

        this.info('Waiting to download...');

        this.git(process.cwd())
            .silent(true)
            .clone(pluginTemplateRepo, projectPath, `--depth=1`, (err) => {
                if (err) {
                    this.error(err);
                }
                else {
                    this.fs.removeSync(path.join(projectPath, '.git'));
                    this.processPlugin(projectPath, plugin);
                    this.info(`Installation success! \nYou can develop the plugin inside ${projectPath}`);
                }
            });
    }

    /**
     * replace steamer-plugin-example & ExamplePlugin
     * @param {String} projectPath project path
     * @param {String} plugin plugin short name
     */
    processPlugin(projectPath, plugin) {
        let pkgJson = path.join(projectPath, 'package.json');
        let indexFile = path.join(projectPath, 'index.js');
        let regex1 = new RegExp(`steamer-plugin-example`, 'ig');
        let regex2 = new RegExp(`ExamplePlugin`, 'ig');

        if (this.fs.existsSync(pkgJson)) {
            let pkgJsonContent = this.fs.readFileSync(pkgJson, 'utf-8');

            pkgJsonContent = pkgJsonContent.replace(regex1, `${this.pluginPrefix}${plugin}`);
            this.fs.writeFileSync(pkgJson, pkgJsonContent);
        }
        else {
            this.fileNotExist(projectPath);
        }

        if (this.fs.existsSync(indexFile)) {
            let indexContent = this.fs.readFileSync(indexFile, 'utf-8');
            let pluginClass = `${this._.upperFirst(plugin)}Plugin`;

            indexContent = indexContent.replace(regex1, `${this.pluginPrefix}${plugin}`);
            indexContent = indexContent.replace(regex2, pluginClass);
            this.fs.writeFileSync(indexFile, indexContent);
        }
        else {
            this.fileNotExist(projectPath);
        }

    }

    /**
     * install starterkit template
     * @param {String} kit
     */
    kit(kit) {
        let kitName = `${this.kitPrefix}${kit}`;
        let projectPath = path.join(process.cwd(), kitName);
        let kitTempalte = 'https://github.com/steamerjs/steamer-example';

        if (this.fs.existsSync(projectPath)) {
            return this.folderExist(projectPath);
        }

        this.info('Waiting to download...');

        this.git(process.cwd())
            .silent(true)
            .clone(kitTempalte, projectPath, `--depth=1`, (err) => {
                if (err) {
                    this.error(err);
                }
                else {
                    this.fs.removeSync(path.join(projectPath, '.git'));
                    this.processKit(projectPath, kit);
                    this.info(`Installation success! \nYou can develop the starterkit inside ${projectPath}`);
                }
            });
    }

    /**
     * replace steamer-example and create ./steamer/steamer-xxx.js
     * @param {String} projectPath
     * @param {String} kit
     */
    processKit(projectPath, kit) {
        let pkgJson = path.join(projectPath, 'package.json');
        let kitConfig = path.join(projectPath, './.steamer/steamer-example.js');
        let regex1 = new RegExp(`steamer-example`, 'ig');

        if (this.fs.existsSync(pkgJson)) {
            let pkgJsonContent = this.fs.readFileSync(pkgJson, 'utf-8');

            pkgJsonContent = pkgJsonContent.replace(regex1, `${this.kitPrefix}${kit}`);
            this.fs.writeFileSync(pkgJson, pkgJsonContent);
        }

        this.fs.copySync(kitConfig, path.join(projectPath, `./.steamer/${this.kitPrefix}${kit}.js`));
        this.fs.removeSync(kitConfig);
    }

    /**
     * install team config tempalte
     * @param {*} team
     */
    team(team) {
        let teamName = `${this.teamPrefix}${team}`;
        let projectPath = path.join(process.cwd(), teamName);
        let teamTempalte = 'https://github.com/steamerjs/steamer-team-default';
        
        if (this.fs.existsSync(projectPath)) {
            return this.folderExist(projectPath);
        }

        this.info('Waiting to download...');
        
        this.git(process.cwd())
            .silent(true)
            .clone(teamTempalte, projectPath, `--depth=1`, (err) => {
                if (err) {
                    this.error(err);
                }
                else {
                    this.fs.removeSync(path.join(projectPath, '.git'));
                    this.processTeam(projectPath, team);
                    this.info(`Installation success! \nYou can develop the team config inside ${projectPath}`);
                }
            });
    }

    /**
     * replace steamer-team-default package.json and index.js
     * @param {String} projectPath
     * @param {String} team
     */
    processTeam(projectPath, team) {
        let pkgJson = path.join(projectPath, 'package.json');
        let teamFile = path.join(projectPath, 'index.js');
        let regex1 = new RegExp(`steamer-team-default`, 'ig');

        if (this.fs.existsSync(pkgJson)) {
            let pkgJsonContent = this.fs.readFileSync(pkgJson, 'utf-8');

            pkgJsonContent = pkgJsonContent.replace(regex1, `${this.teamPrefix}${team}`);
            this.fs.writeFileSync(pkgJson, pkgJsonContent);
        }

        if (this.fs.existsSync(teamFile)) {
            let teamFileContent = this.fs.readFileSync(teamFile, 'utf-8');
            teamFileContent = teamFileContent.replace('TEAM: \'default\'', `TEAM: \'${team}\'`);
            this.fs.writeFileSync(teamFile, teamFileContent);
        }
    }

    folderExist(projectPath) {
        throw new Error(`${projectPath} exists.`);
    }

    fileNotExist(projectPath) {
        throw new Error(`${projectPath} not exists.`);
    }

    help() {
        this.printUsage(this.description, 'develop');
        this.printOption([
            {
                option: 'plugin',
                alias: 'p',
                description: 'generate template for plugin development'
            },
            {
                option: 'kit',
                alias: 'k',
                description: 'generate template for starterkit development'
            },
            {
                option: 'team',
                alias: 't',
                description: 'generate template for team config development'
            }
        ]);
    }
}

module.exports = DevelopPlugin;
