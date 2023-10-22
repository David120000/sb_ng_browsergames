package rd.sb_ng_browsergames.httpfilter;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import rd.sb_ng_browsergames.service.utility.JwtUtil;
import rd.sb_ng_browsergames.service.utility.UserDetailsObjProvider;

@Component
public class JwtParamFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserDetailsObjProvider userObjProvider;


    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String authorizationParam = request.getParameter("authorization");

        if(authorizationParam != null && authorizationParam.startsWith("jwt.")) {

            String jwt = authorizationParam.substring(4);
            String userName = jwtUtil.extractUserName(jwt);

             if(SecurityContextHolder.getContext().getAuthentication() == null) {

                UserDetails userDetails = userObjProvider.loadUserByUsername(userName);

                if(userDetails != null && jwtUtil.validateToken(jwt, userDetails) == true) {

                    UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

                    usernamePasswordAuthenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                    SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);
                }
            }
        }

        filterChain.doFilter(request, response);
    }
    
}
