#!/bin/bash
killall node
cd /home/kodikos/projects/kodikosERP

portsFirmsFile=portsFirms.json
if [ ! -f $portsFirmsFile ]; then
    echo Projects settings file $portsFirmsFile not found.
    echo Please create one first.
    exit 1
fi

echo Using projects settings file $portsFirmsFile
activeCount=`jq '.[] | select(.active).nazwa' $portsFirmsFile | wc -l`
echo Active projects count: $activeCount

cd ./backend
npm i
cd ..
npm i


for (( i=0; i<$activeCount; i++ ))
do
    nazwa=`jq --argjson i $i -r '.[$i] | select(.active).nazwa' $portsFirmsFile`
    backendPort=`jq --argjson i $i '.[$i] | select(.active).backendPort' $portsFirmsFile`
    frontendPort=`jq --argjson i $i '.[$i] | select(.active).frontendPort' $portsFirmsFile`
    catalogFront=`jq --argjson i $i -r '.[$i] | select(.active).catalogFront' $portsFirmsFile`
    
    echo Building project: $nazwa for production
    echo Backend port: $backendPort
    echo Frontend port: $frontendPort
    echo Frontent catalog: $catalogFront
    
    cp ./src/environments/environment.prod_$nazwa.ts ./src/environments/environment.prod.ts
    ng build --output-path=$catalogFront --prod
    cp ./src/environments/environment_local.ts ./src/environments/environment.ts
done
echo done.
