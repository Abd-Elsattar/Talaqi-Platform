
namespace Talaqi.API
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.

            builder.Services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            #region Configuration Sources 
            //هنا يامعلم بنعرف ال application يقرأ منين ال configuration بتاعه
            //اول حاجه هي ملف ال appsettings.json 
            // تاني حاجه هي ال user secrets ودي بتستخدم في ال development عشان نخبي حاجات زي connection strings و API keys
            // تالت حاجه هي ال environment variables ودي بتستخدم في ال production عشان نخبي نفس الحاجات دي
            builder.Configuration
                .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
                .AddUserSecrets<Program>(optional: true, reloadOnChange: true)
                .AddEnvironmentVariables(); 
            #endregion

           


            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            app.UseAuthorization();


            app.MapControllers();

            app.Run();
        }
    }
}
