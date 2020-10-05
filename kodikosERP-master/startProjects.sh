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

if [ ! -d node_modules ] || [ ! -d backend/node_modules ] || [ ! -d dist ]; then
    echo Projects were not yet built.
    echo Please use build.sh or build_prod.sh first.
    exit 1
fi

for (( i=0; i<$activeCount; i++ ))
do
    nazwa=`jq --argjson i $i -r '.[$i] | select(.active).nazwa' $portsFirmsFile`
    backendPort=`jq --argjson i $i '.[$i] | select(.active).backendPort' $portsFirmsFile`
    frontendPort=`jq --argjson i $i '.[$i] | select(.active).frontendPort' $portsFirmsFile`
    catalogFront=`jq --argjson i $i -r '.[$i] | select(.active).catalogFront' $portsFirmsFile`
    
    echo Starting project: $nazwa
    echo Backend port: $backendPort
    echo Frontend port: $frontendPort
    echo Frontent catalog: $catalogFront
    
    node backend/backendStart.js $backendPort $nazwa 1>>backend$nazwa.log 2>>backend$nazwa.err &
    node serverDeployStatic.js $frontendPort $nazwa 1>>frontend$nazwa.log 2>>frontend$nazwa.err &
    
done
echo done.
