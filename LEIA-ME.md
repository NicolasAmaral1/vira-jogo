# 🎲 VIRA - Deploy Easypanel (ATUALIZADO)

## ✅ Padrão de Nomes das Cartas

Suas cartas devem ter **exatamente** este formato:

```
Final.VIRA_page-0001.jpg
Final.VIRA_page-0002.jpg
Final.VIRA_page-0003.jpg
...
Final.VIRA_page-0054.jpg
```

⚠️ **IMPORTANTE**: 
- Use 4 dígitos com zeros à esquerda (0001, 0002, não 1, 2)
- Respeite maiúsculas/minúsculas: `Final.VIRA_page-` (não `final.vira_page-`)
- Extensão: `.jpg` (minúscula)

---

## 🚀 Deploy Rápido

### 1. Extrair o ZIP

```bash
unzip vira-easypanel-final.zip
cd vira-easypanel-final
```

### 2. Adicionar suas cartas

Copie suas 54 imagens para a pasta `cartas/`:

```
vira-easypanel-final/
└── cartas/
    ├── Final.VIRA_page-0001.jpg
    ├── Final.VIRA_page-0002.jpg
    ├── Final.VIRA_page-0003.jpg
    └── ... (até 0054)
```

### 3. Subir para GitHub

```bash
git init
git add .
git commit -m "VIRA game"
git remote add origin https://github.com/SEU-USUARIO/vira.git
git push -u origin main
```

### 4. Deploy no Easypanel

1. Login no Easypanel
2. New App → GitHub
3. Selecione o repositório
4. Configure:
   - **Build Method**: Dockerfile (auto-detectado)
   - **Port**: 80
5. Deploy!

---

## 📂 Estrutura de Arquivos

```
vira-easypanel-final/
├── Dockerfile              ← Easypanel usa isso
├── docker-compose.yml      
├── nginx.conf              
├── index.html              ← Jogo (renomeado de vira-final.html)
├── cartas.json             ← Config das cartas
├── .dockerignore
└── cartas/                 ← SUAS 54 CARTAS AQUI
    ├── Final.VIRA_page-0001.jpg
    ├── Final.VIRA_page-0002.jpg
    └── ...
```

---

## 🔧 Configurações Easypanel

### Build
- Builder: Docker
- Dockerfile: `./Dockerfile`
- Context: `.`

### Port
- Container Port: `80`
- Exposed Port: `80` (ou qualquer outra)

### Recursos (Sugestão)
- Memory: 128MB
- CPU: 0.5 cores

---

## 🎨 Personalizar Nomes dos Desafios

Edite `cartas.json` ou o array no `index.html`:

```json
{
  "id": 1,
  "temp": 1,
  "slug": "carta-01",
  "name": "Batalha de Flexão",  ← Mude aqui
  "image": "cartas/Final.VIRA_page-0001.jpg"
}
```

---

## 🔄 Atualizar Cartas ou Código

```bash
# Edite os arquivos
# Commit e push
git add .
git commit -m "Update"
git push

# No Easypanel: clique em Redeploy
# Ou ative Auto-Deploy para fazer isso automaticamente
```

---

## 🆘 Troubleshooting

**Imagens não aparecem?**
→ Verifique os nomes: `Final.VIRA_page-0001.jpg` (com 4 dígitos)
→ Certifique-se que estão na pasta `cartas/`

**Build falha "No such file or directory"?**
→ Crie a pasta `cartas/` mesmo que vazia
→ Verifique se o Dockerfile está na raiz

**Porta não funciona?**
→ Configure Container Port como `80` no Easypanel

---

## 📝 Diferenças desta Versão

✅ Renomeado `vira-v2.html` → `index.html` (melhor para Easypanel)  
✅ Padrão de nomes correto: `Final.VIRA_page-XXXX.jpg`  
✅ JSON atualizado com os paths corretos  
✅ README na pasta cartas/ com instruções claras  

---

**Desenvolvido para Genesis | Nicolas Bastos**
