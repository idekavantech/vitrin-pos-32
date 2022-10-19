const createWindowsInstaller = require('electron-winstaller').createWindowsInstaller
const path = require('path')
const VERSION = process.env.npm_package_version;



try {
  console.log('creating windows installer')
  const rootPath = path.join('./')
  const outPath = path.join(rootPath, 'build')
  await createWindowsInstaller({
    appDirectory: path.join(outPath, 'vitrin-pos-win32-x64/'),
    noMsi: true,
    outputDirectory: path.join(outPath, 'installable'),
    authors: 'Idekavan Inc.',
    exe: 'vitrin-pos.exe',
    setupExe: `VitrinPOS-${VERSION}-64bit.exe`,
    setupIcon: path.join(rootPath, 'assets', 'icon.ico'),
    skipUpdateIcon: true,
    loadingGif: path.join(rootPath, 'assets', 'loading.gif'),
  })
} catch (e) {
  console.log(`No dice: ${e.message}`)
}
//
//
// getInstallerConfig()
//   .then(createWindowsInstaller)
//   .catch((error) => {
//     console.error(error.message || error)
//     process.exit(1)
//   })
//
// function getInstallerConfig() {
//   console.log('creating windows installer')
//   const rootPath = path.join('./')
//   const outPath = path.join(rootPath, 'build')
//
//   return Promise.resolve({
//     appDirectory: path.join(outPath, 'vitrin-pos-win32-x64/'),
//     // appDirectory: path.join(outPath, 'vitrin-pos-win32-ia32/'),
//     authors: 'komeilmehranfar',
//     noMsi: true,
//     outputDirectory: path.join(outPath, 'installable'),
//     exe: 'vitrin-pos.exe',
//     setupExe: `VitrinPOS-${VERSION}-64bit.exe`,
//     setupIcon: path.join(rootPath, 'assets', 'icon.ico'),
//     skipUpdateIcon: true,
//     loadingGif: path.join(rootPath, 'assets', 'loading.gif'),
//   })
// }
