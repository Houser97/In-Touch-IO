# Notas
Backend creado con .NET 9
- Comprobar versión de .NET instalada
```bash
dotnet --info
```

- Ver plantillas disponibles.
```bash
dotnet new list
```

- El proyecto deseado se ejecuta con
```bash
dotnet watch
```

## Git
- En la terminal se pueden ver las opciones disponibles:
  - Entre estas opciones se tiene la plantilla de gitignore.
```bash
dotnet new list
```

1. Crear gitignore en root de todo el proyecto (reactivities).
```bash
dotnet new gitignore
```

2. Incluir en gitignore que se desea ignora:
  - appsettings.json
  - bases de datos (reactivities.db)

## Configuraciones
### Campos con camelCase
- En Program.cs

```cs
builder.Services
    .AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNameCaseInsensitive = true;
        options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
    });
```

- Cuando se usa ExpandoObject se tiene que hace de forma manual el mapeo de PascalCase a camelCase como fue el caso de la creacion de chat.
 ```cs
foreach (var prop in chatDto.GetType().GetProperties())
{
    var camelCaseName = char.ToLowerInvariant(prop.Name[0]) + prop.Name.Substring(1);
    resultDict[camelCaseName] = prop.GetValue(chatDto);
} 
 ```

## 01. Creación de proyecto
1. Crear archivo de solution usando la plantilla __Solution File__, el cual tiene como short name __sln__.
    - Es un contenedor para diferentes proyectos.
```bash
dotnet new sln
```

2. Crear proyecto con la plantilla __ASP.NET Core Web API__, cuyo short name es: __webapi__.
    - Con __-n__ se especifica el nombre del proyecto.
    - Se especifica que se desea iniciar el proyecto con la configuración mínima. Ya que se van a ir colocando los controladores en su respectiva carpeta se pasa el switch de __-controllers__.
```bash
dotnet new webapi -n API -controllers
```

3. Se definen __Class libraries__. Se crea una para cada una de las siguiente opciones. Estas opciones se presentaron al inicio del proyecto, en donde representan la arquitectura de la aplicación.
    - Domain
    - Application
    - Persistence
```bash
dotnet new classlib -n Domain
dotnet new classlib -n Application
dotnet new classlib -n Persistence
```

4. Añadir estos proyectos en el archivo de solución.
```bash
dotnet sln add API
dotnet sln add Domain
dotnet sln add Application
dotnet sln add Persistence
```

5. Se deben configurar las referencias. Se debe añadir una referencia de API yendo hacia APPLICATION.
    1. En VS Code, en la parte de navegación se tiene un apartado de __SOLUTION EXPLORER__, en donde aparecen los proyectos añadidos al archivo de soluciones.
    2. Hacer click derecho sobre __API__ y seleccionar opción __Add Project Reference__.
    3. Seleccionar opción de __Application__.
    4. Haciendo click izquierdo sobre __API__ se abre el archivo __API.csproj__, en donde se aprecia que aparece ya la referencia del proyecto que va a __Application__.
        - Aparece en el segundo <ItemGroup>.
```xml
<Project Sdk="Microsoft.NET.Sdk.Web">

  <PropertyGroup>
    <TargetFramework>net9.0</TargetFramework>
    <Nullable>enable</Nullable>
    <ImplicitUsings>enable</ImplicitUsings>
  </PropertyGroup>

  <ItemGroup>
    <PackageReference Include="Microsoft.AspNetCore.OpenApi" Version="9.0.4" />
  </ItemGroup>

  <ItemGroup>
    <ProjectReference Include="..\Application\Application.csproj" />
  </ItemGroup>

</Project>

```

6. Siguiendo con la parte de referencias, __Application__ requiere de dos referencias:
    - Domain
    - Persistence

- El dominio no depende de nada, por lo que no se agregan referencias.

## 02. Configuración de proyecto API
1. Configurar el puerto en: __API\Properties\launchSettings.json__.
```json
{
  "$schema": "https://json.schemastore.org/launchsettings.json",
  "profiles": {
    "http": {
      "commandName": "Project",
      "dotnetRunMessages": true,
      "launchBrowser": false,
      "applicationUrl": "http://localhost:5030",
      "environmentVariables": {
        "ASPNETCORE_ENVIRONMENT": "Development"
      }
    },
    "https": {
      "commandName": "Project",
      "dotnetRunMessages": true,
      "launchBrowser": false,
      "applicationUrl": "https://localhost:7125;http://localhost:5030",
      "environmentVariables": {
        "ASPNETCORE_ENVIRONMENT": "Development"
      }
    }
  }
}

```

2. Se elimina la parte de __http__.
    - Esto significa que se va a iniciar la aplicación por medio de __https__.
    - .NET usa un __self-signed certificate__, pero cuando se instala el SDK ahora debería ser __trusted__.
    - Del URL de la aplicación se elimina la parte HTTP y se modifica el puerto de HTTPS por 5001, el cual es como solía ser antes de que se generara de forma aleatoria en esta versión 9.
```json
{
  "$schema": "https://json.schemastore.org/launchsettings.json",
  "profiles": {
    "https": {
      "commandName": "Project",
      "dotnetRunMessages": true,
      "launchBrowser": false,
      "applicationUrl": "https://localhost:5001",
      "environmentVariables": {
        "ASPNETCORE_ENVIRONMENT": "Development"
      }
    }
  }
}

```

- En caso de que el certificado no sea __trusted__, se debe estar en el directorio de API y correr los siguiente comandos uno tras del otro en la terminal. Finalmente, se debe reinicar el navegador.
```bash
dotnet dev-certs https --clean
dotnet dev-certs https --trust
```

3. Simplificar referencias del proyecto. En __API.csproj__ se elimina el siguiente apartado:
```xml
   <ItemGroup>
    <PackageReference Include="Microsoft.AspNetCore.OpenApi" Version="9.0.4" />
  </ItemGroup>
```

- Lo que hace que el archivo quede de la siguiente manera:
```xml
<Project Sdk="Microsoft.NET.Sdk.Web">

  <PropertyGroup>
    <TargetFramework>net9.0</TargetFramework>
    <Nullable>enable</Nullable>
    <ImplicitUsings>enable</ImplicitUsings>
  </PropertyGroup>

  <ItemGroup>
    <ProjectReference Include="..\Application\Application.csproj" />
  </ItemGroup>

</Project>

```

4. Eliminar archivo __API.http__, el cual provee una manera de testear API endpoints, lo cual requiere instalar una extensión de VS Code para usarla. Sin embargo, se usará Postman para las pruebas.

5. Archivo __Program.cs__.
    - Típicamente se ve un método __main__. Sin embargo, Microsoft eliminó ese boilerplate hace que ese método exista, pero no se ve acá, sino que está en el __background__. Entonces, se tiene un main method que hace que el código en Pogram.cs se ejecute.
    - En este archivo se tienen dos secciones:
        - Services
            - Sirve para cuando se desea usar algo entonces se crea una clase que realiza esa actividad, la cual da una funcionalidad. Se puede querer usar esa clase dentro de API controller. Entonces, se realiza inyección de dependencia, la cual está gestionada por el framework al crear una nueva instancia de esa clase así como deshacerse de ella cuando el controller ya no esté en uso.
            - Se tiene __AddOpenApi__, el cual sirve para la documentación de las APIs. En este proyecto no se usa, por lo que se elimina. De esta forma, los servicios solo se quedan con la adición de controladores por medio de __AddControllers()__.
        - Configuración de HTTP request pipeline.
            - Se configuran las middlewares.
            - Así como con los servicios, se elimina la parte de OpenAPI.
            - Se eliminan de igual forma:
                - app.UseHttpsRedirection();
                    - Se borra ya que se va a correr en HTTPS la aplicación.
                - app.UseAuthorization();
                    - Se va a configurar la autorazación después, pero por el momento no se necesita aún.
            - La parte de __app.MapControllers();__ provee de enrutamiento, lo que permitió pasar la request al controlador de weather forecast cuando se colocó en endpoint en el navegador.
```c#
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();

var app = builder.Build();

// Configure the HTTP request pipeline.

app.MapControllers();

app.Run();

```

## 03. Conexión a base de datos
### MongoDB
1. Instalar __MongoDB.Driver @MongoDB Inc.__ para 
  - __Persistence__.
  - __Domain__. Se necesita en domain para el tipado de las entidades.
  - __API__. Se necesita para poder hacer configuraciones como evitar que se traigan campos adicionales que no estén en la clase de entidad. Por ejemplo, el campo de MongoDB \__v__.

2. Colocar configuración en __ServerNET\API\appsettings.json__.
  - Colocar información de la base de datos.
```json
{
  "InTouchIoDatabase": {
    "ConnectionString": "...",
    "DatabaseName": "...",
    "ChatsCollectionName": "chats",
    "UsersCollectionName": "users",
    "MessagesCollectionName": "messages"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*"
}

```

3. Crear __Persistence\AppDbSettings.cs__.
  - Se usa para tener la configuración de la base de datos que se coloca en __API\appsettings.json__
```c#
using System;

namespace Persistence;

public class AppDbSettings
{
    public string ConnectionString { get; set; } = null!;
    public string DatabaseName { get; set; } = null!;
    public string MessagesCollectionName { get; set; } = null!;
    public string ChatsCollectionName { get; set; } = null!;
    public string UsersCollectionName { get; set; } = null!;
}
```

4. Crear __Persistence\AppDbContext.cs__.
  - Se debe instalar __Microsoft.Extensions.Options @Microsoft__. Se usa la versión con la que se trabaja de .NET.

__Versión anterior, se omite ya que no se desea tener dependencia a Domain__.
```c#
using System;

using Domain;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace Persistence;

public class AppDbContext
{
    private readonly IMongoDatabase _database;
    private readonly AppDbSettings _settings;

    public AppDbContext(IOptions<AppDbSettings> settings)
    {
        _settings = settings.Value;
        var client = new MongoClient(settings.Value.ConnectionString);
        _database = client.GetDatabase(settings.Value.DatabaseName);
    }

    public IMongoCollection<Message> Messages => _database.GetCollection<Message>(_settings.MessagesCollectionName);
    public IMongoCollection<Message> Users => _database.GetCollection<Message>(_settings.UsersCollectionName);
    public IMongoCollection<Message> Chats => _database.GetCollection<Message>(_settings.ChatsCollectionName);
}

```

- Se usa la siguiente versión para no tener que usar le entidad __Message__ en esta parte.
__Versión usada__
```c#
using System;

using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace Persistence;

public class AppDbContext
{
    private readonly IMongoDatabase _database;

    public AppDbContext(IOptions<AppDbSettings> settings)
    {
        var client = new MongoClient(settings.Value.ConnectionString);
        _database = client.GetDatabase(settings.Value.DatabaseName);
    }

    public IMongoDatabase Database => _database;
}
```

5. Incluir en Program.cs.
  - En el código, la instancia de configuración a la que la sección appsettings.json del archivo __InTouchIoDatabase__ enlaza está registrada en el contenedor de inserción de dependencias (DI). Por ejemplo, una propiedad __AppDbContext__ del objeto ConnectionString se rellena con la propiedad __InTouchIoDatabase__:ConnectionString en appsettings.json.
  - Servicio de AppDbContext como singleton.
```c#
using Persistence;

var builder = WebApplication.CreateBuilder(args);

// Configure settings inject IOptions<AppDbSettings>
builder.Services.Configure<AppDbSettings>(
    builder.Configuration.GetSection("InTouchIoDatabase"));

// Register AppDbContext as singleton
builder.Services.AddSingleton<AppDbContext>();

// Add services to the container.

builder.Services.AddControllers();

var app = builder.Build();

// Configure the HTTP request pipeline.

app.MapControllers();

app.Run();

```

6. Configurar MongoDb para ignorar campos que no estén en entidad definida en Domain.
  - Esto se hace para evitar errores como:  Element '__v' does not match any field or property of class Domain.Message.
  - Esto se debe hacer para cada Entidad.

__Program.cs__
```c#
using Application.Messages;
using Domain;
using MongoDB.Bson.Serialization;
using Persistence;

var builder = WebApplication.CreateBuilder(args);

BsonClassMap.RegisterClassMap<Message>(cm =>
{
    cm.AutoMap();
    cm.SetIgnoreExtraElements(true);
});

```

## 04. Creación de entidades
### Entidad de mensage
1. Crear __Domain\Message.cs__.
  - Algunas son opcionals ya que hay campos que se fueron agregando en mongo con el tiempo.

```c#
using System;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Domain;

public class Message
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    [BsonElement("_id")]
    public string? Id { get; set; }

    [BsonRepresentation(BsonType.ObjectId)]
    [BsonElement("sender")]
    public string Sender { get; set; } = null!;

    [BsonElement("content")]
    public string Content { get; set; } = null!;

    [BsonRepresentation(BsonType.ObjectId)]
    [BsonElement("chat")]
    public string Chat { get; set; } = null!;

    [BsonElement("isSeen")]
    public bool IsSeen { get; set; }

    [BsonElement("image")]
    public string? Image { get; set; }

    [BsonElement("createdAt")]
    public DateTime CreatedAt { get; set; }

    [BsonElement("updatedAt")]
    public DateTime? UpdatedAt { get; set; }
}


```

- En la clase anterior, se requiere la propiedad Id:
  - Para asignar el objeto de Common Language Runtime (CLR) a la colección de MongoDB.
  - Para anotarla con [BsonId] a fin de designarla como clave principal del documento.
  - Anotado con [BsonRepresentation(BsonType.ObjectId)] para permitir el paso del parámetro como tipo string en lugar de una estructura ObjectId. Mongo controla la conversión de string a ObjectId.

### Entidad de User


## 05. Autenticación con JWT
1. Instalar __Microsoft.AspNetCore.Authentication.JwtBearer @Microsoft__. Se instala la versión 9.0.4, la cual es la versión que corresponde con la versión que se está usando de .NET. Se instala en:
  - API
  - Application

2. Instalar paquete __BCrypt.Net-Next @Chris McKee, Ryan D. Emerl, Damien Miller__ en __Application__, ya que acá se encuentra el servicios de autenticación que compara o crea constraseñas.


3. Crear __ServerNET\Application\Auth\JwtSettings.cs__.
```c#
using System;

namespace Application.Auth;

public class JwtSettings
{
    public string Key { get; set; } = null!;
    public string Issuer { get; set; } = null!;
    public string Audience { get; set; } = null!;
    public int ExpiresInMinutes { get; set; }
}

```
4. Configurar JWT en __Progam.cs__

__Servicios__
```c#
// 1. JWT configuration
builder.Services.Configure<JwtSettings>(
    builder.Configuration.GetSection("Jwt")
);

var jwtSettings = builder.Configuration.GetSection("Jwt").Get<JwtSettings>();

// 2. Add authentication
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings?.Issuer,
        ValidAudience = jwtSettings?.Audience,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings!.Key))
    };
});

// 3. Add authorization
builder.Services.AddAuthorization();

```

__Tener middleware de autenticación y autorización__
```c#
app.UseAuthentication();
app.UseAuthorization();
```

__Program.cs__
```c#
using System.Text;
using Application.Auth;
using Application.Messages;
using Domain;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using MongoDB.Bson.Serialization;
using Persistence;

var builder = WebApplication.CreateBuilder(args);

// Mongo Configuration
BsonClassMap.RegisterClassMap<Message>(cm =>
{
    cm.AutoMap();
    cm.SetIgnoreExtraElements(true);
});

// Configure settings inject IOptions<AppDbSettings>
builder.Services.Configure<AppDbSettings>(
    builder.Configuration.GetSection("InTouchIoDatabase"));

// Register AppDbContext as singleton
builder.Services.AddSingleton<AppDbContext>();

builder.Services.AddScoped<MessageService>();

// 1. JWT configuration
builder.Services.Configure<JwtSettings>(
    builder.Configuration.GetSection("Jwt")
);

var jwtSettings = builder.Configuration.GetSection("Jwt").Get<JwtSettings>();

// 2. Add authentication
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings?.Issuer,
        ValidAudience = jwtSettings?.Audience,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings!.Key))
    };
});

// 3. Add authorization
builder.Services.AddAuthorization();







// Add services to the container.

builder.Services.AddControllers();

var app = builder.Build();

// Configure the HTTP request pipeline.

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();

```
5. Crear configuración en __API\appsettings.json__
```json
"Jwt": {
  "Key": "superclaveultrasecreta",  // 🔐 cámbiala por una más segura
  "Issuer": "IntouchApp",
  "Audience": "IntouchUsers",
  "ExpiresInMinutes": 60
}

```

6. Crear generador de token __Application\Auth\JwtTokenGenerator.cs__.
  - En esta parte se recibe la entidad User la cual se usa para generar las claims que irán en el token.
```c#
using System;

using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Domain;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace Application.Auth;

public class JwtTokenGenerator(IOptions<JwtSettings> options)
{
    private readonly JwtSettings _settings = options.Value;

    public string GenerateToken(User user)
    {
        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Name, user.Name)
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_settings.Key));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _settings.Issuer,
            audience: _settings.Audience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(_settings.ExpiresInMinutes),          
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
```

7. Registrar servicio como Singleton.
```c#
builder.Services.AddSingleton<JwtTokenGenerator>();
```

8. Dto para login.
__Application\DTOs\LoginUserDto.cs__
```c#
using System;
using System.ComponentModel.DataAnnotations;

namespace Application.DTOs;

public class LoginUserDto
{
    [Required(ErrorMessage = "Name is required")]
    [MinLength(3, ErrorMessage = "Name should have at least 3 characters")]
    public string Name { get; set; } = null!;

    [Required(ErrorMessage = "Password is required")]
    [MinLength(6, ErrorMessage = "Password should have at least 6 characters")]
    public string Password { get; set; } = null!;
}


```

9. Dto de respuesta de autenticación.
  - Se usa para el servicio de auth, ya que ahí no se pueden usar cosas como BadRequest.
__Application\DTOs\AuthResultDto.cs__
```c#
using System;
using Domain;

namespace Application.DTOs;

public class AuthResultDto
{
    public bool Success { get; set; }
    public string? Token { get; set; }
    public string? Message { get; set; }
    public User? User { get; set; }
}

```

10. Controlador para login. 

```c#
using System.Security.Claims;
using Application.Auth;
using Application.DTOs;
using Domain;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using Persistence;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController(AuthService authService) : ControllerBase
    {

        private readonly AuthService _authService = authService;

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginUserDto loginUserDto)
        {
            var result = await _authService.Login(loginUserDto);

            if (!result.Success)
            {
                return BadRequest(new { message = result.Message });
            }

            return Ok(new
            {
                user = result.User,
                token = result.Token
            });
        }

        [HttpGet("me")]
        public IActionResult GetCurrentUser()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var email = User.FindFirst(ClaimTypes.Email)?.Value;

            return Ok(new { userId, email });
        }
    }
}
```

11. Proteger endpoints con [Authorize].


## 06. Creación de servicios
### Auth
__Application\Auth\AuthService.cs__
```c#
using System;
using Application.DTOs;
using Domain;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using Persistence;

namespace Application.Auth;

public class AuthService(JwtTokenGenerator tokenGenerator, AppDbContext dbContext, IOptions<AppDbSettings> settings)
{
    private readonly JwtTokenGenerator _tokenGenerator = tokenGenerator;
    private readonly IMongoCollection<User> _usersCollection = dbContext.Database.GetCollection<User>(settings.Value.UsersCollectionName);

    public async Task<AuthResultDto> Login(LoginUserDto loginUserDto)
    {
        var user = await _usersCollection.Find(u => u.Name == loginUserDto.Name).FirstOrDefaultAsync();

        if (user == null)
        {
            return new AuthResultDto
            {
                Success = false,
                Message = "User does not exist"
            };
        }

        bool passwordMatches = BCrypt.Net.BCrypt.Verify(loginUserDto.Password, user.Password);

        if (!passwordMatches)
        {
            return new AuthResultDto
            {
                Success = false,
                Message = "Password is incorrect"
            };
        }


        var token = _tokenGenerator.GenerateToken(user);
        user.Password = "";

        return new AuthResultDto
        {
            Success = true,
            Token = token,
            User = user
        };

    }
}

```
### Mensajes
1. Crear __Application\Messages\MessageService.cs__.
- En esta parte se hace notar que no se tiene __populate__ como en node, ya que esto se usaba con ayuda de __mongoose__.
- En el código que retorna Result se especifica object, ya que el DTO que se reotrna es anónimo, es decir, no tiene una clase definida explícitamente.

```c#
var chatDto = new
{
    Chat = chat,
    Users = users,
    LastMessage = lastMessage,
    UnseenMessages = unseenMessages
};
```

Al usar un tipo anónimo con new { ... }, el compilador lo convierte en un tipo sin nombre. Entonces:

- No puedes especificar directamente el tipo (porque no existe fuera del método).

- Por eso, para poder retornarlo, lo declaras como object, que es el tipo base de todos en .NET.
  - Se podría tener un DTO para no tener que usar object.

- Uso de project.
  - MongoDB .Project() te permite seleccionar solamente ciertos campos de un documento, como lo harías con .select('name email') en Mongoose.

- Usa FilterDefinition con Builders<T>.Filter.AnyEq que está diseñado para trabajar con arrays en MongoDB:

```c#
var filter = Builders<Chat>.Filter.AnyEq(c => c.Users, userId);
var chats = await _chatsCollection.Find(filter).ToListAsync();
```

Esto traduce correctamente a una consulta MongoDB como:

```js
{ users: { $in: [userId] } }
```

AnyEq verifica que el array Users contenga exactamente ese userId.

2. Registrar servicio en Program.cs
  - Se registra como Scope ya que solo se usará en el contexto de cada petición.

```c#
builder.Services.AddScoped<MessageService>();
```

3. Usar en controlador. 


## 07. Política de autorización por defecto
- En Program.cs
```c#
builder.Services.AddAuthorizationBuilder()
    .SetFallbackPolicy(new Microsoft.AspNetCore.Authorization.AuthorizationPolicyBuilder()
    .RequireAuthenticatedUser()
    .Build());
```


## 08. SingalR
1. Crear carpeta __SignalR__ en __API__.
  - Al crear la carpeta, en el archivo de __API.csproj__ debe aparecer.

```xml
  <ItemGroup>
    <Folder Include="SignalR\" />
  </ItemGroup>
```

2. Creación del Hub para el chat.
  1. Crear __ServerNET/API/SignalR/ChatHub.cs__.
  
3. Agregar servicio a Program.cs
```c#
// SignalR
builder.Services.AddSignalR();
```

4. Agregar Middleware para indicarle al servidor API a dónde enviar las solicitudes que llegan a un endpoint en particular.
```c#
app.MapHub<ChatHub>("/chats");
```

### Frontend
npm install @microsoft/signalr

- Crear custom hook
  - Este custom hook encapsula toda la lógica necesaria para conectarse, escuchar eventos, enviar mensajes y manejar reconexiones con un SignalR Hub en el backend
```ts
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import * as signalR from "@microsoft/signalr";
import { AuthContext } from "../providers/AuthProvider";

export const useSocket = (serverUrl: string) => {
  const { auth } = useContext(AuthContext);
  const { user } = auth;

  const connectionRef = useRef<signalR.HubConnection | null>(null);
  const [connected, setConnected] = useState(false);

  const connect = useCallback(async () => {
    const token = localStorage.getItem("token");

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(serverUrl, {
        accessTokenFactory: () => token ?? "",
        skipNegotiation: false,
        transport: signalR.HttpTransportType.LongPolling,
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    connection.onclose(() => setConnected(false));
    connection.onreconnecting(() => setConnected(false));
    connection.onreconnected(() => setConnected(true));

    try {
      await connection.start();
      setConnected(true);
      connectionRef.current = connection;

      console.log("[SignalR] Connected!");

      if (user.id) {
        await connection.invoke("Setup", user.id);
      }
    } catch (error) {
      console.error("[SignalR] Connection failed:", error);
    }
  }, [serverUrl, user.id]);

  const disconnect = useCallback(async () => {
    try {
      await connectionRef.current?.stop();
      setConnected(false);
    } catch (err) {
      console.error("[SignalR] Disconnect failed:", err);
    }
  }, []);

  const send = useCallback(async (method: string, ...args: any[]) => {
    if (
      !connectionRef.current ||
      connectionRef.current.state !== signalR.HubConnectionState.Connected
    ) {
      console.warn("[SignalR] Not connected");
      return;
    }

    try {
      await connectionRef.current.invoke(method, ...args);
    } catch (err) {
      console.error(`[SignalR] Error calling ${method}:`, err);
    }
  }, []);

  const on = useCallback(
    (event: string, callback: (...args: any[]) => void) => {
      if (!connectionRef.current) return;

      connectionRef.current.on(event, callback);

      return () => {
        connectionRef.current?.off(event, callback);
      };
    },
    []
  );

  return {
    connection: connectionRef.current,
    connected,
    connect,
    disconnect,
    send,
    on,
  };
};

```

- En este caso ya que el servidor de desarrollo usa https se colocó la siguiente configuracion, la cual debe cambiar cuando ya este en productivo a true, y usar WebSockets.

```ts
        skipNegotiation: false,
        transport: signalR.HttpTransportType.LongPolling,
```

- connectionRef guarda la instancia de HubConnection y evita recrearla en cada render.
- connected es un estado booleando para saber si estás conectado.

```ts
const connectionRef = useRef<signalR.HubConnection | null>(null);
const [connected, setConnected] = useState(false);
```

- connect() inicia la conexion.
  - Crea una instancia de SignalR con:

    - withUrl(serverUrl): dirección del Hub, por ejemplo: https://localhost:5001/chatHub.

    - accessTokenFactory: le pasa el JWT guardado en localStorage.

    - skipNegotiation: false: permite el paso de "negociación" entre cliente y servidor (explicado abajo).

    - LongPolling: usa HTTP largo, ideal cuando WebSocket no está disponible en desarrollo local (por CORS, proxies, o certificados no válidos).

    - 🛠️ En producción, deberías usar WebSocket y skipNegotiation: true. Pero como estás en desarrollo usando HTTPS, puede haber conflictos con WebSocket si tu certificado no está bien configurado o aceptado por el navegador. Por eso LongPolling + skipNegotiation: false es lo seguro por ahora.
    - Qué es skipNegotiation?
      - skipNegotiation: true: solo funciona si usas WebSockets directamente, sin negociación previa. - 
      - skipNegotiation: false: permite que el cliente y servidor "negocien" el transporte (WebSocket, Server-Sent Events, o LongPolling).  - 
      - Si estás en entorno de desarrollo con HTTPS y el navegador no confía en tu certificado, WebSockets puede fallar, entonces LongPolling es una alternativa segura.
```ts
const connect = useCallback(async () => {
  const token = localStorage.getItem("token");

  const connection = new signalR.HubConnectionBuilder()
    .withUrl(serverUrl, {
      accessTokenFactory: () => token ?? "",
      skipNegotiation: false,
      transport: signalR.HttpTransportType.LongPolling,
    })
    .withAutomaticReconnect()
    .configureLogging(signalR.LogLevel.Information)
    .build();
```

- Manejadores de estado de conexión
  - Actualiza el estado según el estado de la conexión. Muy útil para UI reactiva tipo “Online/Offline”.

```ts
connection.onclose(() => setConnected(false));
connection.onreconnecting(() => setConnected(false));
connection.onreconnected(() => setConnected(true));
```

- Iniciar conexion
  - Llama a start() para iniciar la conexión.
  - Luego, llama al método del backend "Setup" pasando el user.id.
```ts
await connection.start();
setConnected(true);
connectionRef.current = connection;
console.log("[SignalR] Connected!");

if (user.id) {
  await connection.invoke("Setup", user.id);
}
```

- disconnect() — Detiene la conexión
```ts
const disconnect = useCallback(async () => {
  try {
    await connectionRef.current?.stop();
    setConnected(false);
  } catch (err) {
    console.error("[SignalR] Disconnect failed:", err);
  }
}, []);

```

- 📤 send() — Invocar métodos del Hub
  - Invoca métodos en el servidor, como SendMessage, JoinRoom, etc.
```ts
const send = useCallback(async (method: string, ...args: any[]) => {
  if (!connectionRef.current || connectionRef.current.state !== signalR.HubConnectionState.Connected) {
    console.warn("[SignalR] Not connected");
    return;
  }

  try {
    await connectionRef.current.invoke(method, ...args);
  } catch (err) {
    console.error(`[SignalR] Error calling ${method}:`, err);
  }
}, []);
```



- 📥 on() — Escuchar eventos del servidor
  - Suscribe el cliente a eventos emitidos desde el servidor, como "message-received".
```ts
const on = useCallback((event: string, callback: (...args: any[]) => void) => {
  if (!connectionRef.current) return;

  connectionRef.current.on(event, callback);

  return () => {
    connectionRef.current?.off(event, callback);
  };
}, []);

```

- Por ejemplo
```ts
useEffect(() => {
  const unsubscribe = on("personal-message-chat", (data) => {
    console.log("Mensaje recibido:", data);
  });

  return () => unsubscribe?.();
}, []);
```

-  ¿Por qué usar ...args?
Porque te da un wrapper universal. No necesitas crear funciones separadas para cada método del Hub. Ejemplo:

❌ Sin ...args — menos flexible
ts
Copy
Edit
const sendMessage = async (chatId: string, content: string, image?: string) => {
  await connectionRef.current?.invoke("SendMessage", chatId, content, image);
};

const updateStatus = async (userId: string, status: string) => {
  await connectionRef.current?.invoke("UpdateUserStatus", userId, status);
};
Tienes que crear una función por cada método. 😓

✅ Con ...args — ultra flexible
ts
Copy
Edit
send("SendMessage", chatId, content, image);
send("UpdateUserStatus", userId, "online");
send("JoinRoom", roomId);
send("MarkAsSeen", chatId, messageId);
¡Una función para gobernarlos a todos! 🧙‍♂️











- Definir Socket provider.
  - Aca se define el url de conexion y se usan los metodos de connect y disconnect

```ts
import { createContext, PropsWithChildren, useContext, useEffect } from "react";
import { AuthContext } from "./AuthProvider";
import { HubConnection } from "@microsoft/signalr";
import { useSocket } from "../hooks/useSocket";

interface SignalRContextProps {
  connection: HubConnection | null;
  connected: boolean;
  send: (method: string, ...args: any[]) => Promise<void>;
  on: (
    event: string,
    callback: (...args: any[]) => void
  ) => (() => void) | void;
}

export const SocketContext = createContext<SignalRContextProps>({
  connection: null,
  connected: false,
  send: async () => {},
  on: () => {},
});

export const SocketProvider = ({ children }: PropsWithChildren) => {
  const { connection, connected, connect, disconnect, send, on } = useSocket(
    //"https://in-touch-io.onrender.com/chats"
    "https://localhost:5001/signalR"
  );
  const { auth } = useContext(AuthContext);

  useEffect(() => {
    if (auth.status === "authenticated") {
      connect();
    } else {
      disconnect();
    }
  }, [auth.status]);

  return (
    <SocketContext.Provider value={{ connection, connected, send, on }}>
      {children}
    </SocketContext.Provider>
  );
};

```

- Se usan los nombres usados en los metodos del backend para invocarlos. Por ejemplo, para ChatProvider en donde se requiere hacer que el usuario se una o salga del chat.

```ts
    const joinChat = (id: string) => {
        socket?.invoke('JoinChat', id);
    }

    const leaveChat = (id: string) => {
        socket?.invoke('LeaveChat', id);
    }
```


- Por otro lado, se escuchan eventos del backend por medio del useEffect. Esto se ve en MessageProvider.

```ts
    useEffect(() => {
        if (!socket) return;
        
        const handleChatUpdate = (chatPayload: {
            chat: any;
            unseenMessages: any[];
        }) => {
            console.log(chatPayload);
            const { chat: updatedChat, unseenMessages } = chatPayload;
            const chatEntity = ChatMapper.toEntity(updatedChat, unseenMessages);

            setUserChats((prev) => {
                const updatedChats = { ...prev };
                delete updatedChats[chatEntity.id];
                return { [chatEntity.id]: chatEntity, ...updatedChats };
            });
        };
        socket.on('personal-message-chat', handleChatUpdate);

        return () => {
          socket.off("personal-message-chat", handleChatUpdate);
        };
    }, [socket])

    useEffect(() => {
        if (!socket) return;

        const handleNewMessage = (message: any) => {
            const messageEntity = MessageMapper.toEntity(message);
            setMessages((prev) => [messageEntity, ...prev]);
        };

        socket.on("personal-message-local", handleNewMessage);

        return () => {
            socket.off("PersonalMessageLocal", handleNewMessage);
        };
    }, [socket])
```

# Pendientes
- Al crear Chat se debe mostrar el chat creado para la segunda persona, ya que al crear un nuevo chat no se actualiza para la persona nueva solo hasta refrescar la app, ni aunque se reciban mensajes
- Al refrescar navevagor revisar si no afecta que el usuario vuelva a unirse al chat de su id.

- Agregar paginaciones en busqueda de usuarios.
- Borrar imagen de usuario cuando actualice su foto.
- Colocar IsSeen en true cuando el otro usuario este presente en el chat.
  - No se tiene al igual que con node una forma de traer todos los sockets, cosa que se hizo con node para ver si el numero de sockets en el chat era mayor que 1 para saber si el otro usuario estaba en el chat.
- Definir archivo de variables de entorno en Vite.
  - Se debe ajustar el url en client/src/presentation/providers/SocketProvider.tsx.

- Revisar mensaje de 'Wrong credentials' que sale el login del cliente.

- 

- El email debe venir siempre en minúsculas para autenticación. Revisar si se le da formato el email.
  - Pendiente ver si hay una mejor forma de hacer en LoginUserDto.

- Afinar endpoint que revisa la validez de la sesión y retorna la información del usuario.

- Revisar validaciones en DTOs.
  - Ver si se instala FluentValidation.

## Terminado
- Crear política de autenticación para evitar tener que poner [Authorize] en cada controlador. De esta forma solo se deberían especificar los que son accesibles sin autenticación.
- infinite scroll no estéa funcionando en los chats. Solo funciona la primera vez en el primer chat que se abre.
  - Sucedia que la variable page en custom hook no se reiniciaba al valor inicial al abrir un nuevo chat, por lo que se quedaba con el valor dado con otro chat. Ahora se recibe el page y la funcion setter como argumento en lugar de manejarlo en el custom hook.
- Validar creacion de chats