SOURCE="${PWD}/lib/undomanager.js"
TARGET="${PWD}/demo/js/undomanager.js"

rm -rf ${TARGET}
ln -s ${SOURCE} ${TARGET}
