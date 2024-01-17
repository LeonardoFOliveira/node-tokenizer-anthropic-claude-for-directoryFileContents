var tokenizer = require('@anthropic-ai/tokenizer');
const fs = require('fs');
const path = require('path');

const PASTA_EXCLUIDA = "node_modules";

let tokens = 0;

function listarArquivosEConteudo(diretorio, callback) {
    fs.readdir(diretorio, (err, arquivos) => {
        if (err) {
            console.error("Erro ao ler o diretório:", err);
            return callback(err);
        }

        if (arquivos.length === 0) return callback();

        let pendentes = arquivos.length;

        arquivos.forEach(arquivo => {
            let caminhoCompleto = path.join(diretorio, arquivo);

            // Se for a pasta excluída, simplesmente retorne
            if (caminhoCompleto === path.join(diretorio, PASTA_EXCLUIDA)) {
                pendentes--;
                if (pendentes === 0) callback();
                return;
            }

            fs.stat(caminhoCompleto, (err, stats) => {
                if (err) {
                    console.error("Erro ao obter estatísticas do arquivo:", err);
                    return callback(err);
                }

                if (stats.isDirectory()) {
                    listarArquivosEConteudo(caminhoCompleto, () => {
                        pendentes--;
                        if (pendentes === 0) callback();
                    });
                } else {
                    // Lendo o conteúdo do arquivo
                    fs.readFile(caminhoCompleto, 'utf8', (err, conteudo) => {
                        if (err) {
                            console.error(`Erro ao ler o arquivo ${caminhoCompleto}:`, err);
                        } else {
                            const tokensArquivo = tokenizer.countTokens(conteudo);
                            tokens += tokensArquivo;
                            console.log("Arquivo: " + caminhoCompleto + " | tokens: " + tokensArquivo);
                        }

                        pendentes--;
                        if (pendentes === 0) callback();
                    });
                }
            });
        });
    });
}

listarArquivosEConteudo('C:\\Projects\\XPTO', () => {
    console.log("Total de tokens: " + tokens);
});

