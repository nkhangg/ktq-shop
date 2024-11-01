import { mkdirSync } from 'fs';
import { join } from 'path';
import GenerateBase from '../generate-base';
import { Project } from 'ts-morph';
export default class GenerateCommand extends GenerateBase {
    private ignoreKey = 'ig-cg';
    private servicePath: string;
    private controllerPath: string;
    private includeControllerFolder: boolean;
    private moduleFolder = join(__dirname, '../../modules');
    private project = new Project();
    constructor() {
        super();
    }

    setServicePath(servicePath: string) {
        this.servicePath = servicePath;
    }

    setControllerPath(controllerPath: string) {
        this.controllerPath = controllerPath;
    }

    isControllerFolder(isControllerFolder: boolean) {
        this.includeControllerFolder = isControllerFolder;
    }

    getNameControllerFormPath() {
        if (!this.controllerPath) return null;

        const splitData = this.controllerPath.split('/');

        if (!splitData.length) return null;

        if (!splitData[splitData.length - 1].includes('.controller.ts')) return null;

        return splitData[splitData.length - 1];
    }

    getNameServiceFormPath() {
        if (!this.servicePath) return null;

        const splitData = this.servicePath.split('/');

        if (!splitData.length) return null;

        if (!splitData[splitData.length - 1].includes('.service.ts')) return null;

        return splitData[splitData.length - 1];
    }

    getServiceClassFormPath() {
        const sourceFile = this.project.addSourceFileAtPath(this.servicePath);

        if (!sourceFile) return null;

        // Lấy class đầu tiên trong file (bạn có thể điều chỉnh để chọn class mong muốn)
        const classDeclaration = sourceFile.getClass(() => true);

        if (!classDeclaration) return null;
        const methods = classDeclaration.getMethods();

        return methods.filter((method) => {
            return !method.getLeadingCommentRanges().some((item) => item.getText().includes(this.ignoreKey));
        });
    }

    generate() {
        const controllerName = this.getNameControllerFormPath();

        if (!this.fileExists(this.servicePath)) {
            console.log("The service is not exits. It't need to generate controller");
            return;
        }

        if (!this.fileExists(this.controllerPath)) {
            // this.createControllerWithNameFile(controllerName.split('.')[0], this.includeControllerFolder);
        }

        const fns = this.getServiceClassFormPath();

        if (!fns) {
            console.log('Error when read service');
            return;
        }

        fns.forEach((method) => {
            // Lấy các argument của phương thức
            const parameters = method.getParameters();

            console.log(`Arguments for method ${method.getName()}:`);

            parameters.forEach((param) => {
                console.log(`- Name: ${param.getName()}`);
                console.log(`  Type: ${param.getType().getProperty('id').getName()}`);
            });
        });

        console.log({
            controller: this.getNameControllerFormPath(),
            service: this.getNameServiceFormPath(),
        });
    }

    generateWithModuleName(moduleName: string, isControllerFolder: boolean) {
        const modulePath = join(this.moduleFolder, moduleName);
        const controllerFolderPath = join(modulePath, 'controllers');
        this.isControllerFolder(isControllerFolder);

        if (!this.fileExists(modulePath)) {
            console.log('The module name is not exist');
            return;
        }

        if (this.includeControllerFolder && !this.fileExists(controllerFolderPath)) {
            mkdirSync(controllerFolderPath, { recursive: true });

            this.setControllerPath(join(controllerFolderPath, `${moduleName}.controller.ts`));
        } else {
            this.setControllerPath(join(modulePath, `${moduleName}.controller.ts`));
        }

        this.setServicePath(join(modulePath, `${moduleName}.service.ts`));

        this.generate();
    }
}
