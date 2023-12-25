#!/bin/bash
# Új page létrehozása nextjs app rooted web siteban
# inidása abból a direktorivól ahol az "app" subdir van.
# par1: ebből kiindulva (csupa kisbetü pl. "about")
# par2: új page neve (csupa kisbetü pl:proba)

if [ "$1" = '-v' ]; then
	echo "create new page into nexjs app routed application v1.0"
	exit 0
fi
if [ "$1" = '--version' ]; then
	echo "create new page into nexjs app routed application v1.0"
	exit 0
fi

if [ "$#" -ne 2 ]; then
	echo "create new page into nexjs app routed application"
	echo "use"
	echo "cd reporoot"
	echo "newpage.sh fromname toname"
	echo " "
	echo "example:"
	echo "newpage.sh about proba"
	echo " "
	exit 0
fi

FILE=app
if [ ! -d "$FILE" ]; then
    echo "app folder not exists"
    echo "see --help"
    exit 0
fi

fromName=$1
toName=$2
FromName=${fromName^}
ToName=${toName^}
#új könyvtár a components alá
mkdir "components/"$ToName"Page"
# fájlok másolása az új könyvtárba
cp "components/"$FromName"Page/"$FromName"Page.tsx" "components/"$ToName"Page/"$ToName"Page.tsx" 
cp "components/"$FromName"Page/"$fromName".module.scss" "components/"$ToName"Page/"$toName".module.scss"  2> /dev/null
cp "components/"$FromName"Page/index.ts" "components/"$ToName"Page/index.ts"
# másolt fájlok modosítása
sed -i "s/"$fromName"/"$toName"/g" "components/"$ToName"Page/"$ToName"Page.tsx" 
sed -i "s/"$FromName"/"$ToName"/g" "components/"$ToName"Page/"$ToName"Page.tsx" 
sed -i "s/"$FromName"/"$ToName"/g" "components/"$ToName"Page/index.ts" 
# új könyvtár az app alá
mkdir "app/"$toName
# fájl másolás ebbe az újkönyvtárba
cp "app/"$fromName"/page.tsx" "app/"$toName"/page.tsx"
# másolt fájl modosítása 
sed -i "s/"$FromName"/"$ToName"/g" "app/"$toName"/page.tsx"
# update components/index.ts
echo -e "export * from './"$ToName"Page';" >> components/index.ts 


 

