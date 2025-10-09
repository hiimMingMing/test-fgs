var os = require('os');
var path = require('path');
var fs = require('fs');
var csv = require('csv-parser');
var lodash = require('lodash');

const make_dir = (dir) => {
    const seperate = path.sep;
    dir.split(seperate).reduce((directories, directory) => {
        directories += `${directory}${seperate}`;

        if (!fs.existsSync(directories)) {
            fs.mkdirSync(directories);
        }

        return directories;
    }, '');
};

const main = (input, output, fallback) => {
    console.log(`Reading ${input}`);
    var i18 = {};
    var headers = {};
    var data = [];

    // Read CSV file
    fs.createReadStream(input)
        .pipe(csv())
        .on('data', (row) => {
            // Extract headers from first row (::ID::, ::EN::)
            if (Object.keys(headers).length === 0) {
                Object.keys(row).forEach((col, index) => {
                    const regexHeader = /(::)(\w*)(::)/gm;
                    let matchesHeader = regexHeader.exec(col);
                    if (matchesHeader !== null) {
                        headers[index] = matchesHeader[2];
                    }
                });
            }

            // Store data row
            data.push(row);
        })
        .on('end', () => {
            console.log('CSV file successfully processed');

            // Process the data similar to Excel version
            const columnNames = Object.keys(data[0]);

            // Set headers based on column names if regex didn't match
            if (Object.keys(headers).length === 0) {
                columnNames.forEach((col, index) => {
                    const regexHeader = /(::)(\w*)(::)/gm;
                    let matchesHeader = regexHeader.exec(col);
                    if (matchesHeader !== null) {
                        headers[index] = matchesHeader[2];
                    }
                });
            }

            // translate id-text
            for (
                let i = 0, keys = Object.keys(headers), len = keys.length;
                i < len;
                i++
            ) {
                let id = headers[keys[0]];
                let language = headers[keys[i]];

                if (!i18.hasOwnProperty(language)) {
                    i18[language] = {};
                }

                // Convert data array to keyed object
                let keyedData = {};
                data.forEach((row, index) => {
                    const keyValue = row[columnNames[0]];
                    if (keyValue) {
                        keyedData[keyValue] = row;
                    }
                });

                let define = lodash.mapValues(keyedData, (value, key, obj) => {
                    if (value) {
                        if (id === language) {
                            const keyIndex = Object.keys(obj).indexOf(key);
                            return Object.keys(i18[id]).length + keyIndex;
                        }

                        const languageCol = columnNames.find((col) => {
                            const regexHeader = /(::)(\w*)(::)/gm;
                            let matchesHeader = regexHeader.exec(col);
                            return (
                                matchesHeader && matchesHeader[2] === language
                            );
                        });

                        if (languageCol && value[languageCol]) {
                            return value[languageCol];
                        }

                        if (fallback) {
                            const fallbackCol = columnNames.find((col) => {
                                const regexHeader = /(::)(\w*)(::)/gm;
                                let matchesHeader = regexHeader.exec(col);
                                return (
                                    matchesHeader &&
                                    matchesHeader[2] === fallback
                                );
                            });
                            if (fallbackCol && value[fallbackCol]) {
                                return value[fallbackCol];
                            }
                        }

                        return `${id}:${value[columnNames[0]]}`;
                    }
                });

                i18[language] = Object.assign({}, i18[language], define);
            }

            // Write output files
            writeOutputFiles(i18, output);
        });
};

const writeOutputFiles = (i18, output) => {
    const TAB = '    '; // 4 spaces

    Object.keys(i18).forEach((language, index) => {
        let define = JSON.stringify(i18[language], null, 4);
        let file = path.join(output, `${language}.ts`);
        console.log(`Writing ${file}`);
        if (!fs.existsSync(output)) {
            const result = process.versions;
            let nodeVersion = 0;
            if (result && result.node) {
                // console.log('node version', result.node)
                nodeVersion = parseInt(result.node);
            }

            // https://joshtronic.com/2021/01/17/recursively-create-directories-with-nodejs/
            if (nodeVersion > 10) {
                fs.mkdirSync(output, { recursive: true });
            } else {
                make_dir(output);
            }
        }

        if (index === 0) {
            fs.writeFileSync(
                `${file}`,
                `type i18n_ID = {${os.EOL}${TAB}[key: string]: number${os.EOL}}${os.EOL}${os.EOL}`
            );
            fs.appendFileSync(
                `${file}`,
                `export const ${language}: i18n_ID = ${define}`
            );
        } else {
            fs.writeFileSync(
                `${file}`,
                `type i18n_TEXT = {${os.EOL}${TAB}[key: string]: string${os.EOL}}${os.EOL}${os.EOL}`
            );
            fs.appendFileSync(
                `${file}`,
                `export const ${language}: i18n_TEXT = ${define}`
            );
        }
    });
};

// const input = path.resolve(process.argv[2])
// const output = path.resolve(process.argv[3])
// const fallback = process.argv.length > 4 ? process.argv[4] : null
const input = path.resolve('./localization.csv');
const output = path.resolve('./assets/i18n/data');
const fallback = null;
main(input, output, fallback);
