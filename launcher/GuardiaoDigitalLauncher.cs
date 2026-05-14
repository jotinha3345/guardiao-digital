using System;
using System.Diagnostics;
using System.IO;

public static class GuardiaoDigitalLauncher
{
    public static void Main()
    {
        string baseDir = AppDomain.CurrentDomain.BaseDirectory;
        string script = Path.Combine(baseDir, "GuardiaoDigital.bat");

        if (!File.Exists(script))
        {
            Console.WriteLine("Arquivo GuardiaoDigital.bat nao encontrado.");
            Console.WriteLine("Mantenha o executavel na raiz do projeto Guardiao Digital.");
            Console.ReadKey();
            return;
        }

        var startInfo = new ProcessStartInfo
        {
            FileName = "cmd.exe",
            Arguments = "/k \"\"" + script + "\"\"",
            WorkingDirectory = baseDir,
            UseShellExecute = true
        };

        Process.Start(startInfo);
    }
}
