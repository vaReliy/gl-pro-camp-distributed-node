import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHomePage(ip: string): string {
    const parts = ip.split('::ffff:');
    const clientIP = parts.length === 2 ? parts[1] : ip;

    return homePageHtmlTemplate(clientIP);
  }
}

function homePageHtmlTemplate(ip: string): string {
  return `<html>
  <h1>GL Pro Camp<h1/>
  <h2>Distributed node<h2/>
  <h3>Your IP address is: ${ip}<h3/>
  <a href="/api">API<a/><br><br>
  <a href="/users">Users<a/>
  <html/>`;
}
