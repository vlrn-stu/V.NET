# Stage 1: Build
FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /src
COPY ["Server/V.NET.Server.csproj", "Server/"]
COPY ["Client/V.NET.Client.csproj", "Client/"]
COPY ["Shared/V.NET.Shared.csproj", "Shared/"]
RUN dotnet restore "Server/V.NET.Server.csproj"
COPY . .
WORKDIR "/src/Server"
RUN dotnet build "V.NET.Server.csproj" -c Release -o /app/build

# Stage 2: Publish
FROM build AS publish
RUN dotnet publish "V.NET.Server.csproj" -c Release -o /app/publish

# Stage 3: Final Image
FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "V.NET.Server.dll"]
