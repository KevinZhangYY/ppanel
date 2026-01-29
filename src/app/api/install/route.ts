import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");
  const host = req.headers.get("host");
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
  const baseUrl = `${protocol}://${host}`;

  if (!token) {
    return new NextResponse("Token is required", { status: 400 });
  }

  const script = `#!/bin/bash

# Configuration
TOKEN="${token}"
API_URL="${baseUrl}/api/report"
INTERVAL=60

echo "Installing PPanel Monitor..."

# Check for dependencies
for pkg in curl bc; do
    if ! command -v $pkg &> /dev/null; then
        echo "Installing $pkg..."
        if command -v apt-get &> /dev/null; then
            apt-get update && apt-get install -y $pkg
        elif command -v yum &> /dev/null; then
            yum install -y $pkg
        fi
    fi
done

# Monitoring script content
cat << EOF > /usr/local/bin/ppanel-monitor.sh
#!/bin/bash
TOKEN="${token}"
API_URL="${baseUrl}/api/report"
EOF

cat << 'EOF' >> /usr/local/bin/ppanel-monitor.sh

while true; do
    # CPU Usage
    CPU_USAGE=$(top -bn1 | grep "Cpu(s)" | sed "s/.*, *\\([0-9.]*\\)%* id.*/\\1/" | awk '{print 100 - $1}')
    
    # RAM Usage (MB)
    RAM_TOTAL=$(free -m | awk '/Mem:/ {print $2}')
    RAM_USED=$(free -m | awk '/Mem:/ {print $3}')
    RAM_USAGE=$(echo "scale=2; $RAM_USED / $RAM_TOTAL * 100" | bc)
    
    # Disk Usage (GB)
    DISK_TOTAL=$(df -BG / | awk 'NR==2 {print $2}' | sed 's/G//')
    DISK_USED=$(df -BG / | awk 'NR==2 {print $3}' | sed 's/G//')
    DISK_USAGE=$(df / | awk 'NR==2 {print $5}' | sed 's/%//')
    
    # Network Traffic (Bytes)
    NET_IN=$(cat /proc/net/dev | grep eth0 | awk '{print $2}')
    NET_OUT=$(cat /proc/net/dev | grep eth0 | awk '{print $10}')
    
    # If eth0 doesn't exist, try common ones
    if [ -z "$NET_IN" ]; then
        NET_IN=$(cat /proc/net/dev | grep -E "ens|eno|enp" | head -n 1 | awk '{print $2}')
        NET_OUT=$(cat /proc/net/dev | grep -E "ens|eno|enp" | head -n 1 | awk '{print $10}')
    fi

    # Load Average
    LOAD=$(cat /proc/loadavg | awk '{print $1}')
    
    # Uptime
    UPTIME=$(cat /proc/uptime | awk '{print int($1)}')

    # JSON payload
    PAYLOAD="{\\"token\\":\\"$TOKEN\\",\\"cpuUsage\\":$CPU_USAGE,\\"ramUsage\\":$RAM_USAGE,\\"ramTotal\\":$RAM_TOTAL,\\"ramUsed\\":$RAM_USED,\\"diskUsage\\":$DISK_USAGE,\\"diskTotal\\":$DISK_TOTAL,\\"diskUsed\\":$DISK_USED,\\"netIn\\":\${NET_IN:-0},\\"netOut\\":\${NET_OUT:-0},\\"load\\":$LOAD,\\"uptime\\":$UPTIME}"

    # Send data
    curl -X POST -H "Content-Type: application/json" -d "$PAYLOAD" "$API_URL"
    
    sleep 60
done
EOF

chmod +x /usr/local/bin/ppanel-monitor.sh

# Create Systemd service
cat << EOF > /etc/systemd/system/ppanel-monitor.service
[Unit]
Description=PPanel VPS Monitor Service
After=network.target

[Service]
Type=simple
ExecStart=/usr/local/bin/ppanel-monitor.sh
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable ppanel-monitor
systemctl restart ppanel-monitor

echo "PPanel Monitor installed and started!"
`;

  return new NextResponse(script, {
    headers: {
      "Content-Type": "text/x-shellscript",
    },
  });
}
