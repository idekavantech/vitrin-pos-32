vitrin-pos is a proprietary software developed for Vitrin site-builder (https://vitrin.me) clients to be installed on their PCs and enhance their e-commerce experience.

# Release new version

- update packages.json version
- remove build & dist folders
- RUN npm run package
- RUN npm run create-installer-win
- commit & push to github
- 
- go to github => releases create new draft release 
- set the tag version to the same version of your package.json
- upload exe and pubg files
- publish new release 
- git pull https://github.com/idekavantech/vitrin-pos-64.git main --allow-unrelated-histories