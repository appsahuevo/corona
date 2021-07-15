using System;
namespace coronaWeb.Controllers
{
    public class Helper
    {
        public const string DefaultAppName = "Corona";

        public static string CreateCode(int size)
        {
            var rdn = new Random();
            var caracteres = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
            var len = caracteres.Length;
            var code = string.Empty;

            for (int i = 0; i < size; i++)
            {
                code += caracteres[rdn.Next(len)].ToString();
            }

            return code;
        }
    }
}
