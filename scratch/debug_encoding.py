with open(r"c:\Users\saleh\OneDrive\Desktop\law n8n\site\contracts.html", "r", encoding="utf-8-sig") as f:
    content = f.read()

# Let's inspect content around index 4968
start = max(0, 4968 - 100)
end = min(len(content), 4968 + 100)
print("--- TEXT AROUND 4968 ---")
print(content[start:end])

# Let's see what bytes we get when we try to encode it as cp1256
for i in range(start, end):
    char = content[i]
    try:
        b = char.encode("cp1256")
        print(f"{i}: {repr(char)} -> {b.hex()}")
    except Exception as e:
        print(f"{i}: {repr(char)} -> ERROR: {e}")
