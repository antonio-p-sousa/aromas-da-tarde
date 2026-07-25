# Constrói o CSV de importação de produtos Shopify a partir do catálogo PHC.
# Regras (reunião 16+23 jul): preço = Preco_ComIVA; excluir preço 0;
# esgotados NÃO aparecem (excluir stock<=0); tags novo/novidade/festivo;
# Type = família; imagens vazias (a pedir ao parceiro que gere o PHC).
import csv, re, unicodedata, io, sys

# Uso: py build-shopify-import.py [catalogo_src.csv] [import_out.csv]
_DEF_SRC = r"C:\Users\aport\OneDrive - theloop.pt\Desktop\Mental Palace\Trabalho\Projetos\Aromas da Tarde\aromas-da-tarde\data\catalogo-artigos-2026-07-25.csv"
_DEF_OUT = r"C:\Users\aport\OneDrive - theloop.pt\Desktop\Mental Palace\Trabalho\Projetos\Aromas da Tarde\aromas-da-tarde\data\shopify-import-aromas-2026-07-25.csv"
SRC = sys.argv[1] if len(sys.argv) > 1 else _DEF_SRC
OUT = sys.argv[2] if len(sys.argv) > 2 else _DEF_OUT

def slug(s):
    s = unicodedata.normalize("NFKD", s).encode("ascii", "ignore").decode()
    s = re.sub(r"[^a-zA-Z0-9]+", "-", s).strip("-").lower()
    return s or "artigo"

COLS = ["Handle","Title","Body (HTML)","Vendor","Type","Tags","Published",
        "Option1 Name","Option1 Value","Variant SKU","Variant Inventory Tracker",
        "Variant Inventory Qty","Variant Inventory Policy","Variant Fulfillment Service",
        "Variant Price","Variant Requires Shipping","Variant Taxable","Variant Barcode",
        "Image Src","Status"]

seen = {}
rows_out = []
stats = {"total":0,"preco_zero":0,"esgotado":0,"incluidos":0}

with io.open(SRC, encoding="utf-8-sig", newline="") as f:
    for r in csv.DictReader(f):
        stats["total"] += 1
        try:
            preco = float(r["Preco_ComIVA"] or 0)
            stock = int(float(r["Stock"] or 0))
        except ValueError:
            preco, stock = 0, 0
        if preco <= 0:
            stats["preco_zero"] += 1; continue
        if stock <= 0:
            stats["esgotado"] += 1; continue

        ref = r["Referencia"].strip()
        design = r["Designacao"].strip()
        h = slug(design)
        if h in seen and seen[h] != ref:
            h = f"{h}-{slug(ref)}"
        seen[h] = ref

        tags = []
        cat = (r["Categoria"] or "").strip()
        if cat and cat.lower() != (r["Familia"] or "").strip().lower():
            tags.append(cat)
        if (r["Novo"] or "").strip().lower() == "true": tags.append("Novo")
        if (r["Novidade"] or "").strip().lower() == "true": tags.append("Novidade")
        if (r["Festivo"] or "").strip().lower() == "true": tags.append("Festivo")

        rows_out.append({
            "Handle": h, "Title": design, "Body (HTML)": "",
            "Vendor": "Aromas da Tarde", "Type": (r["Familia"] or "").strip(),
            "Tags": ", ".join(tags), "Published": "TRUE",
            "Option1 Name": "Title", "Option1 Value": "Default Title",
            "Variant SKU": ref, "Variant Inventory Tracker": "shopify",
            "Variant Inventory Qty": stock, "Variant Inventory Policy": "deny",
            "Variant Fulfillment Service": "manual",
            "Variant Price": f"{preco:.2f}", "Variant Requires Shipping": "TRUE",
            "Variant Taxable": "TRUE", "Variant Barcode": (r["Cod_Barras"] or "").strip(),
            "Image Src": "", "Status": "active",
        })
        stats["incluidos"] += 1

with io.open(OUT, "w", encoding="utf-8-sig", newline="") as f:
    w = csv.DictWriter(f, fieldnames=COLS)
    w.writeheader()
    w.writerows(rows_out)

print(stats)
print("Escrito:", OUT)
