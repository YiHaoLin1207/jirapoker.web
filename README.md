# Stacks

- ASP.NET Core 2.2
- Vue.js 2 (Vue CLI 3)
- PostgreSQL 
- Redis (X)


# Lint and code check

## ASP.NET Core

[StyleCops.Analyzer]()

## Vue CLI

TSLint(TypeScript Lint)

```
$ npm run lint
```

Or lint when saving files,

- vue.config.js

```
module.exports = {
  lintOnSave: process.env.NODE_ENV == 'development',
}
```

# Database Migration

### Create migration

```
$ cd CyberSoft.MiniTis/CyberSoft.MiniTis.WebApi
$ dotnet ef  --project ../CyberSoft.MiniTis.Dal --startup-project . migrations add <migration_name>
```

### Ignore StyleCops brutal rules on migration file

```
// File breginning
#pragma warning disable SA1118 // Parameter must not span multiple lines
#pragma warning disable SA1122 // Use string.Empty for empty strings

// File end
#pragma warning restore SA1118 // Parameter must not span multiple lines
#pragma warning restore SA1122 // Use string.Empty for empty strings
```


### Update database

```
$ dotnet ef  --project ../CyberSoft.MiniTis.Dal --startup-project . database update
```


### Update Identity Sequenence restart value

```
SELECT last_value FROM "MapAccountStatuses_Id_seq";
SELECT last_value FROM "MapLangs_Id_seq";
SELECT last_value FROM "MapStatuses_Id_seq";
SELECT last_value FROM "SysMetadatas_Id_seq";

ALTER SEQUENCE "MapAccountStatuses_Id_seq" RESTART WITH 7;
ALTER SEQUENCE "MapLangs_Id_seq" RESTART WITH 4;
ALTER SEQUENCE "MapStatuses_Id_seq" RESTART WITH 4;
ALTER SEQUENCE "SysMetadatas_Id_seq" RESTART WITH 8;
```


# Windows Authentication

ASP.NET Core uses **Http.Sys** to enable Windows authentication.

In 

- Startup.cs
- Program.cs

To enable it on IIS/IIS Express, define flag: `#define EnableIIS`.
To enable it on Self-hosting, undefine flag: `#undef EnableIIS`.



# i18n

- ASP.NET Core: Resource files
- vue-i18n

Front-end route rules: 

**http://miniTis/zh-Tw/login**

**http://miniTis/zh-CN/login**


Supported scenarios:

1. Load from client side (one-time)

- i18n.ts

```
export const i18n = new VueI18n({
  locale: process.env.VUE_APP_I18N_LOCALE || 'zh-tw',
  fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || 'zh-tw',
  messages: loadLocaleMessages()
});
```

2. Load from server side (by route)

- i18n.ts

```
router.beforeEach((to: any, from: any, next: any) => {
  const lang = to.params.lang;
  const key = to.query.key || to.name;

  if (supportedLanguages.indexOf(to.params.lang) >= 0) {
    loadLanguageAsync(lang, key).then((response) => {
      const msg = new LocaleMsg(lang, response.data);
      i18n.setLocaleMessage(msg.lang, msg.messages);
      next();
    });
  } else {
    // HACK: Alert not supporting the language
    next(false); // Fallback to "from"'s url
  }
});
```

# DTO => DAO

Nuget Package: [AutoMapper](https://www.nuget.org/packages/AutoMapper/)
Define mapping logics on **CyberSoft.MiniTis.Service** -> `AutoMapFactory.cs`.

Usage:

```
 var entity = await AutoMapFactory.CreateAsync<DtoUser, User>(user);
```


# CORS

```
app.UseCors(this.appSettings.Global.CorsPolicyName);
```


# JSNLog

```
app.UseJSNLog(new LoggingAdapter(loggerFactory), new JsnLogConfig(this.Configuration).CustomConfig);
```


# Global Exception handler

```
app.ConfigureExceptionHandler(loggerFactory);
```





