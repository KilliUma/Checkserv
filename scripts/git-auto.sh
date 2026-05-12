#!/bin/sh

set -e

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "Erro: este diretório não é um repositório Git."
  exit 1
fi

MESSAGE="$*"

if [ -z "$MESSAGE" ]; then
  MESSAGE="chore: update $(date +'%Y-%m-%d %H:%M')"
fi

echo "A preparar alterações..."
git add -A

if git diff --cached --quiet; then
  echo "Sem alterações para commit."
  exit 0
fi

echo "A criar commit: $MESSAGE"
git commit -m "$MESSAGE"

if git rev-parse --abbrev-ref --symbolic-full-name "@{u}" >/dev/null 2>&1; then
  echo "A enviar para o remoto (upstream existente)..."
  git push
else
  BRANCH=$(git rev-parse --abbrev-ref HEAD)
  echo "A enviar para origin/$BRANCH (a configurar upstream)..."
  git push -u origin "$BRANCH"
fi

echo "Concluido: commit e push executados com sucesso."
