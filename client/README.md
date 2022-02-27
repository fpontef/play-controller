Atenção, no package.json é necessário definir o proxy pra não ocorrer erro CORS.
Com a última linha do package.json do client (reactjs) ficando assim:
{
  ...
  {
    ...
  },
  "proxy": "http://localhost:5000"
}
