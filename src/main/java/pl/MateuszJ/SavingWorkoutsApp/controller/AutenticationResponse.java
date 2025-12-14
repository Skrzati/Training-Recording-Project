package pl.MateuszJ.SavingWorkoutsApp.controller;

public class AutenticationResponse {
    private String token;

    // Prywatny konstruktor dla Buildera
    private AutenticationResponse(String token) {
        this.token = token;
    }

    // JAWNY GETTER
    public String getToken() { return token; }

    // JAWNA METODA BUILDER()
    public static AutenticationResponseBuilder builder() {
        return new AutenticationResponseBuilder();
    }

    // JAWNA KLASA BUILDERA
    public static class AutenticationResponseBuilder {
        private String token;

        public AutenticationResponseBuilder token(String token) {
            this.token = token;
            return this;
        }

        public AutenticationResponse build() {
            return new AutenticationResponse(token);
        }
    }
}