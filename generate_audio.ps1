Add-Type -AssemblyName System.Speech
$synth = New-Object System.Speech.Synthesis.SpeechSynthesizer
$synth.Rate = -1 # slightly slower, sophisticated luxury pacing

$chapters = @(
    @{
        File = "media/ch1.wav"
        Text = "Welcome to Maison Noir. A digital sanctuary where the ancient craft of coffee leaves behind the utilitarian rush, and ascends into pure ceremony. Founded in 1998, Maison Noir was conceived for the true connoisseur, bringing direct-trade micro-lots and museum-grade digital design together."
    },
    @{
        File = "media/ch2.wav"
        Text = "The aesthetic philosophy of Maison Noir is grounded in haute couture. Deep obsidian blacks, warm champagne gold, and aged parchment color tokens are paired with editorial serif typography and geometric metadata, creating an atmosphere of unhurried luxury."
    },
    @{
        File = "media/ch3.wav"
        Text = "Underneath the hood, modern engineering excellence powers the experience. Built with React 19, Vite 7, TypeScript, and Tailwind CSS version 4, the platform features a zero-dependency Web Audio synthesizer, generating authentic vintage vinyl jazz directly in your browser."
    },
    @{
        File = "media/ch4.wav"
        Text = "Explore live features including simulated drum roaster telemetry from our vintage 1928 Probat roaster, an interactive Coffee Sommelier sensory profiler with cupping dials, and a curated twenty-three item gastronomy menu with five-axis cupping radar meters."
    },
    @{
        File = "media/ch5.wav"
        Text = "Experience the full user journey. Seamless multi-currency conversion supporting Indian Rupees, US Dollars, Euros, British Pounds, and Emirates Dirhams. Manage tasting trays with tableside delivery, and reserve private salon rituals with instant digital pass generation."
    },
    @{
        File = "media/ch6.wav"
        Text = "Maison Noir demonstrates how modern engineering rigor can elevate luxury branding into an unforgettable sensory experience. Thank you for your time, your keen attention, and your shared passion for world-class digital craftsmanship. Enjoy the Maison Noir experience."
    }
)

foreach ($c in $chapters) {
    Write-Host "Synthesizing $($c.File)..."
    $synth.SetOutputToWaveFile($c.File)
    $synth.Speak($c.Text)
}

$synth.Dispose()
Write-Host "All audio chapters synthesized successfully!"
