# build/baf-compiler.py
import re
import os

def compile_baf_v16():
    print("=== INITIATING BAF v16 SOURCE COMPILATION ===")

    # 1. Definisikan jalur file input
    base_xml_path = "src/xml/main-skeleton.xml"

    css_sources = [
        "src/css/base-tokens.css",
        "src/css/behaviors/scroll-hide.css",
        "src/css/components/logo.css",
        "src/css/components/nav-toggle.css",
        "src/css/components/card.css"
    ]

    js_sources = [
        "src/js/controllers/navigation.js",
        "src/js/controllers/focus.js",
        "src/js/controllers/state.js",
        "src/js/app.js"
    ]

    # 2. Baca basis kerangka XML (Main Skeleton)
    if not os.path.exists(base_xml_path):
        raise FileNotFoundError(f"Missing core XML base skeleton at: {base_xml_path}")

    with open(base_xml_path, "r", encoding="utf-8") as f:
        compiled_xml = f.read()

    # 3. Rakit dan gabungkan seluruh modular stylesheets
    compiled_css = "/* =========================================================\n" \
                    "   BAF v16 COMPILED STYLESHEET (PRODUCTION MODE)\n" \
                    "   ========================================================= */\n"
    for css_path in css_sources:
        if os.path.exists(css_path):
            with open(css_path, "r", encoding="utf-8") as f:
                compiled_css += f"\n/* --- Source Module: {css_path} --- */\n" + f.read()
        else:
            print(f"[WARNING] Skipping missing CSS module: {css_path}")

    # 4. Rakit dan gabungkan seluruh behavior controllers
    compiled_js = "/* =========================================================\n" \
                  "   BAF v16 COMPILED BEHAVIOR CONTROLLERS (PRODUCTION MODE)\n" \
                  "   ========================================================= */\n"
    for js_path in js_sources:
        if os.path.exists(js_path):
            with open(js_path, "r", encoding="utf-8") as f:
                compiled_js += f"\n// --- Source Controller: {js_path} ---\n" + f.read()
        else:
            print(f"[WARNING] Skipping missing JS controller: {js_path}")

    # 5. Suntikkan CSS ke dalam tag <b:skin> CDATA secara aman
    compiled_xml = re.sub(
        r"<b:skin><!\[CDATA\[.*?\]\]></b:skin>",
        f"<b:skin><![CDATA[\n{compiled_css}\n]]></b:skin>",
        compiled_xml,
        flags=re.DOTALL
    )

    # 6. Suntikkan JS ke dalam tag script CDATA secara aman
    compiled_xml = re.sub(
        r"<script type='text/javascript'>//<!\[CDATA\[.*?//\]\]></script>",
        f"<script type='text/javascript'>//<![CDATA[\n{compiled_js}\n//]]></script>",
        compiled_xml,
        flags=re.DOTALL
    )

    # 7. Tulis berkas distribusi final (baf-release-v16.xml)
    os.makedirs("dist", exist_ok=True)
    release_path = "dist/baf-release-v16.xml"
    with open(release_path, "w", encoding="utf-8") as f:
        f.write(compiled_xml)

    print(f"[SUCCESS] BAF v16 Compiled Successfully!")
    print(f"Target Build Artifact: {release_path}")
    print("=================================================================")

if __name__ == "__main__":
    compile_baf_v16()
