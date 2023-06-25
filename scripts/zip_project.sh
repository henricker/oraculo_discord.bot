#!/bin/bash

# Cria o arquivo ZIP excluindo as pastas e arquivos desejados
zip -r oraculo_discord_bot.zip . -x "__tests__/*" "coverage/*" ".vscode/*" "dist/*" ".github/*" "node_modules/*" ".git/*" "scripts/*"