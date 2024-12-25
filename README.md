# ScanApp

## Project setup

```
npm install
```

### Compiles and hot-reloads for development

```
npm run serve
```

### Compiles and minifies for production

```
npm run build
```

### Lints and fixes files

```
npm run lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

### For deploying cloud functions

```
gcloud functions deploy read_qrcode --runtime python312 --trigger-http --allow-unauthenticated --region europe-west1 --set-secrets "/secrets/firebase-admin-key=firebase-admin-key:latest" --verbosity debug
```

# make sure there is no venv folder left
