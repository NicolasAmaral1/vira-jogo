FROM nginx:alpine

# Copiar os arquivos do jogo para o diretório padrão do nginx
COPY index.html /usr/share/nginx/html/index.html
COPY cartas.json /usr/share/nginx/html/cartas.json
COPY cartas/ /usr/share/nginx/html/cartas/

# Configuração customizada do nginx (opcional)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
