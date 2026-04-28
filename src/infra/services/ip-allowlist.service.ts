export class IpAllowlistService {
  private readonly allowed: Set<string>;

  constructor(rawList: string | undefined = process.env.STUDIO_IP_RANGES) {
    this.allowed = new Set(
      (rawList ?? '')
        .split(',')
        .map((ip) => ip.trim())
        .filter((ip) => ip.length > 0),
    );
  }

  isOutsideStudio(ip: string | undefined): boolean {
    if (this.allowed.size === 0) return false;
    if (!ip) return true;
    return !this.allowed.has(ip);
  }
}
