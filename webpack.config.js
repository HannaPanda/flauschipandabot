const fs = require('fs');
const path = require('path');

// Verzeichnis, in dem Ihre TS-Dateien liegen
const entryDir = path.join(__dirname, 'Frontend');

// Funktion zum Einlesen des Verzeichnisses und Erstellen der Entrypoints
const createEntryPoints = () => {
    const entries = {};
    fs.readdirSync(entryDir).forEach(file => {
        if (file.endsWith('.ts')) {
            // Der Schlüsselname ist der Dateiname ohne Erweiterung
            const name = path.basename(file, '.ts').toLowerCase();
            entries[name] = path.join(entryDir, file);
        }
    });
    return entries;
};

module.exports = {
    mode: 'development',
    entry: createEntryPoints(),
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'public/js'),
    },
};
