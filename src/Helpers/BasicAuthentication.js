import Elysia from "elysia"

export default function BasicAuthentication(Users, Realm = "Protected") {
    function Unauthorized() {
        return new Response(
            "Unauthorized",
            {
                status: 401,
                headers: {
                    "WWW-Authenticate": `Basic realm="${Realm}"`
                }
            }
        )
    }

    function ParseHeader(Context) {
        const AuthorizationHeader = Context.request.headers.get("authorization")
        if (!AuthorizationHeader) { return false }
        if (!AuthorizationHeader.startsWith("Basic ")) { return false }
        try {
            return atob(AuthorizationHeader.split(" ")[1]).split(":")
        } catch (error) {
            return false
        }
    }

    function CheckUser(ParsedHeader) {
        return Users.find(
            (User) => {
                return User.Username == ParsedHeader[0] && User.Password == ParsedHeader[1]
            }
        )
    }

    return new Elysia(
        {
            name: "BasicAuthentication",
            seed: {
                Users: Users,
                Realm: Realm,
                ErrorFunction: ErrorFunction
            }
        }
    ).onRequest(
        (Context) => {
            const ParsedHeader = ParseHeader(Context)
            if (!ParsedHeader) { return Unauthorized() }
            if (!CheckUser(ParsedHeader)) { return Unauthorized() }
        }
    )
}