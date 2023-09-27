package rd.sb_ng_browsergames.service.utility;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

@Service
public class JwtUtil {

    private final String SECRET_KEY;

    public JwtUtil() {
        this.SECRET_KEY = "2023demofsproj1";
    }

    /* CREATE NEW TOKENS */
    public String generateToken(UserDetails userDetails) {

        String token = Jwts.builder()
            .setClaims(getLoadableTokenClaims(userDetails))
            .setSubject(userDetails.getUsername())
            .setIssuedAt(new Date(System.currentTimeMillis()))
            .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10))  // 10-hours expiration
            .signWith(SignatureAlgorithm.HS256, SECRET_KEY)
            .compact();

        return token;
    }

    private Map<String, Object> getLoadableTokenClaims(UserDetails userDetails) {
        
        Map<String, Object> claims = new HashMap<>();

        claims.put("namefromuserdetails", userDetails.getUsername());
        claims.put("simpleuser", true);

        return claims;
    }

    /* EXTRACT TOKEN INFORMATION */
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        
        Claims claims = extractAllClaims(token);
        
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {

        Claims claims = Jwts.parser()
            .setSigningKey(SECRET_KEY)
            .parseClaimsJws(token)
            .getBody();
        
        return claims;
    }

    public String extractUserName(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    /* VALIDATE TOKEN */
    public Boolean validateToken(String token, UserDetails userDetails) {
        
        String userName = extractUserName(token);

        Boolean validity = (userName.equals(userDetails.getUsername()) == true && isTokenExpired(token) == false);
        
        return validity;
    }

    
    
}
