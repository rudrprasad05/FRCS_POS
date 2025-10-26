Run Test
dotnet test --collect:"XPlat Code Coverage" --logger trx --results-directory ./coverage

Generate Report
reportgenerator -reports:"./coverage/**/coverage.cobertura.xml" -targetdir:"./coverage-report" -reporttypes:Html
