const dns = require("dns");

dns.setServers([
    "8.8.8.8",
    "8.8.4.4"
]);

dns.resolveSrv(
    "_mongodb._tcp.nodeapi.j8uncp1.mongodb.net",
    (error, addresses) => {
        if (error) {
            console.error("DNS failed:", error.message);
        } else {
            console.log("DNS works:", addresses);
        }
    }
);