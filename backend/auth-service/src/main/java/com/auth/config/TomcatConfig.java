package com.auth.config;

import org.apache.coyote.http11.Http11Nio2Protocol;
import org.springframework.boot.tomcat.servlet.TomcatServletWebServerFactory;
import org.springframework.boot.web.server.WebServerFactoryCustomizer;
import org.springframework.context.annotation.Configuration;

/**
 * Forces Tomcat's NIO2 connector instead of the default NIO one. The default
 * NIO connector opens a java.nio.channels.Selector, whose internal wakeup
 * pipe uses a Unix Domain Socket on Windows and fails with
 * "Unable to establish loopback connection" on machines where Docker/WSL has
 * altered the loopback interface. NIO2 (AsynchronousServerSocketChannel)
 * doesn't hit that code path.
 */
@Configuration
public class TomcatConfig implements WebServerFactoryCustomizer<TomcatServletWebServerFactory> {
    @Override
    public void customize(TomcatServletWebServerFactory factory) {
        factory.setProtocol(Http11Nio2Protocol.class.getName());
    }
}
