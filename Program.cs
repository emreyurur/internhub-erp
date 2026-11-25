using InterntManagementSystem.Data;
using InterntManagementSystem.Interface.Repository;
using InterntManagementSystem.Interface.Repository.Mentor;

using InterntManagementSystem.Repository.Mentors;
using InterntManagementSystem.Repository.Users;
using InterntManagementSystem.Repository.Assigments;
using InterntManagementSystem.Service;
using Microsoft.EntityFrameworkCore;
// using InterntManagementSystem.Interface.Service.AdminService;
using InterntManagementSystem.Repository;
using InterntManagementSystem.Interface.Service;
using InterntManagementSystem.Interface.Repository.Task;
using InterntManagementSystem.Interface.Repository.Enums;
using InterntManagementSystem.Repository.Enums;
using InterntManagementSystem.Service.CreateUserService;
using InterntManagementSystem.Interface.Repository.Admin;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.Converters.Add(new System.Text.Json.Serialization.JsonStringEnumConverter());
});
builder.Services.AddEndpointsApiExplorer();

// Dependency Injection
builder.Services.AddScoped<IMentorRepository, Mentors>();
builder.Services.AddScoped<IUserRepository, User>();
builder.Services.AddScoped<IAssigmentRepository, Assigments>();
builder.Services.AddScoped<IAdminRepository, Admins>();


builder.Services.AddScoped<IAdminService, AdminService>();

//burası db ile olabilir
builder.Services.AddScoped<IEnumsRepository, Enums>();


// CORS for Angular frontend (local dev + configurable Vercel origins)
builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendPolicy", policy =>
    {
        var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>();
        if (allowedOrigins is { Length: > 0 })
        {
            policy.WithOrigins(allowedOrigins)
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        }
        else
        {
            policy.AllowAnyOrigin()
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        }
    });
});

// Database Context
builder.Services.AddDbContext<ApplicationDBContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("FrontendPolicy");
app.UseHttpsRedirection();


app.MapControllers();

app.Run();
