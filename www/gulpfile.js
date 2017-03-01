const gulp = require("gulp")
const fs = require("fs")
const glob = require("glob")
function writeImports(path){
    let dependencies;
    let componentPath = path + "/**/*.png"
    glob( componentPath, {}, function( err, files ) {
        console.log(files)
        if(err) console.error(err);
        let dependencies = files;
        let variableDict = '{\n'
        let importCode = dependencies
            .sort((a,b)=>{return a.length-b.length}, 0)
            .map(
                function(fileName, index){
                    fileName = fileName.split(path).join('.')
                    let imgVarName = fileName.split('/')[1].split('.png')[0].replace(/(\s|-)/g,'_').toLowerCase()
                    let moduleVarName = `module_${index}`
                    variableDict += `"${imgVarName}":${moduleVarName},\n`
                    return `import ${moduleVarName} from "${fileName}";`
                }
            )
            .join('\n')
        
  variableDict += "\n }"
        
        importCode += `
// This was written by the writeImageImport task in gulpfile.js
const images = ${variableDict}
export default images
`
        fs.writeFile(`${path}/icons.js`, importCode, console.log)
        console.log("Compiling your image import code...")
    })
}

gulp.task('writeImageImport', function(callback) {
    const paths = ['./src/assets/cards/fight-cards','./src/assets/cards/injury-cards']
    paths.forEach(writeImports)
});
gulp.task('default', function(){
    gulp.start('writeImageImport');
})