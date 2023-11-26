import ip from 'ipaddr.js';

export function cleanupIp (str: string) {
  // if it's a valid ipv6 address, and if its a mapped ipv4 address,
  // then clean it up. otherwise return the original string.
  if (ip.IPv6.isValid(str)) {
      const addr = ip.IPv6.parse(str);
      if (addr.isIPv4MappedAddress())
          return addr.toIPv4Address().toString();
  }
  return str;
}
