package pl.MateuszJ.SavingWorkoutsApp.controller;

public class AutenticationResponse {
    private String token;

    private AutenticationResponse(String token) {
        this.token = token;
    }

    public String getToken() {
        return token;
    }

    public static AutenticationResponseBuilder builder() {
        return new AutenticationResponseBuilder();
    }

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