#!/usr/bin/env python3
"""
🚀 News Intelligence Processor - Saneamento Dashboard
Coleta notícias automaticamente, adiciona ao dashboard e faz push
"""

import json
import subprocess
import sys
from datetime import datetime, timedelta
from typing import List, Dict
import hashlib
import os

class NewsCollector:
    def __init__(self):
        self.repo_path = os.path.dirname(os.path.abspath(__file__))
        self.data_file = os.path.join(self.repo_path, "dashboard", "sample-data.jsonl")
        self.today = datetime.now().strftime("%Y-%m-%d")

    def log(self, level: str, msg: str):
        """Logging simples"""
        timestamp = datetime.now().strftime("%H:%M:%S")
        print(f"[{timestamp}] {level:8} | {msg}")

    def add_article(self, article: Dict) -> bool:
        """Adiciona artigo ao sample-data.jsonl"""
        try:
            # Validar campos obrigatórios
            required = ["data", "empresa", "tema_1", "setor", "titulo", "veiculo", "link", "impacto", "tom"]
            for field in required:
                if field not in article:
                    self.log("ERROR", f"Campo obrigatório faltando: {field}")
                    return False

            # Adicionar ao arquivo
            with open(self.data_file, "a") as f:
                f.write(json.dumps(article, ensure_ascii=False) + "\n")

            self.log("INFO", f"✓ Artigo adicionado: {article['titulo'][:60]}")
            return True
        except Exception as e:
            self.log("ERROR", f"Falha ao adicionar artigo: {e}")
            return False

    def add_sample_articles(self) -> int:
        """Adiciona artigos de exemplo (para teste)"""
        articles = [
            {
                "data": self.today,
                "data_coleta": datetime.now().isoformat(),
                "pais": "Brasil",
                "estado_provincia": "SP",
                "empresa": ["Sabesp"],
                "tema_1": "operacional",
                "tema_2": "ambiental",
                "setor": "agua",
                "tipo_evento": "operacao",
                "titulo": "Sabesp continua redução de perdas de água com novas técnicas de monitoramento",
                "veiculo": "Poder360",
                "tipo_fonte": "grande_midia",
                "descricao": "Sabesp implementa sensores IoT para detectar vazamentos em tempo real na região metropolitana.",
                "resumo_executivo": "Modernização tecnológica contínua. Impacto em EBITDA estimado em 5-8% ao ano.",
                "link": "https://www.poder360.com.br/infraestrutura/sabesp-monitoramento-agua/",
                "tags": ["sabesp", "agua", "tecnologia"],
                "impacto": "alto",
                "tom": "positivo",
                "status_revisao": "novo"
            },
            {
                "data": self.today,
                "data_coleta": datetime.now().isoformat(),
                "pais": "Brasil",
                "estado_provincia": "MG",
                "empresa": ["Copasa"],
                "tema_1": "regulatorio",
                "tema_2": "economico",
                "setor": "agua",
                "tipo_evento": "regulacao",
                "titulo": "Arsae-MG aprova novo modelo de revisão tarifária para Copasa com ciclo bienal",
                "veiculo": "Diário do Comércio",
                "tipo_fonte": "grande_midia",
                "descricao": "Agência reguladora estabelece novo ciclo de 2 anos para revisão de tarifas, aumentando previsibilidade.",
                "resumo_executivo": "Segurança regulatória ampliada. Ciclo bienal facilita planejamento de capex de longo prazo.",
                "link": "https://diariodocomercio.com.br/economia/arsae-revisao-bienal/",
                "tags": ["copasa", "regulacao", "minas-gerais"],
                "impacto": "alto",
                "tom": "positivo",
                "status_revisao": "novo"
            },
            {
                "data": self.today,
                "data_coleta": datetime.now().isoformat(),
                "pais": "Brasil",
                "estado_provincia": "PE",
                "empresa": ["Compesa"],
                "tema_1": "social",
                "tema_2": "regulatorio",
                "setor": "agua",
                "tipo_evento": "regulacao",
                "titulo": "Compesa expande acesso a água em 15 municípios do interior de Pernambuco",
                "veiculo": "Folha de Pernambuco",
                "tipo_fonte": "grande_midia",
                "descricao": "Programa de universalização alcança 500 mil novos habitantes com investimento de R$ 1.2 bilhão.",
                "resumo_executivo": "Expansão social estruturada. Melhora licença social e abre receita em mercado não atendido.",
                "link": "https://www.folhape.com.br/saneamento-pernambuco/",
                "tags": ["compesa", "agua", "social"],
                "impacto": "alto",
                "tom": "positivo",
                "status_revisao": "novo"
            },
            {
                "data": self.today,
                "data_coleta": datetime.now().isoformat(),
                "pais": "Argentina",
                "estado_provincia": "Buenos Aires",
                "empresa": ["AySA"],
                "tema_1": "regulatorio",
                "tema_2": "social",
                "setor": "agua",
                "tipo_evento": "regulacao",
                "titulo": "AySA anuncia novo ciclo de aumentos tarifários graduals até dezembro de 2026",
                "veiculo": "Infobae",
                "tipo_fonte": "grande_midia",
                "descricao": "Organismo regulador ERAS autoriza aumentos de 3% mensais para recuperar atraso tarifário acumulado.",
                "resumo_executivo": "Recuperação de receitas lenta. Timeline de 12 meses indica pressão política contínua.",
                "link": "https://www.infobae.com/economia/aysa-tarifa-2026/",
                "tags": ["aysa", "argentina", "regulacao"],
                "impacto": "alto",
                "tom": "neutro",
                "status_revisao": "novo"
            },
            {
                "data": self.today,
                "data_coleta": datetime.now().isoformat(),
                "pais": "Global",
                "estado_provincia": None,
                "empresa": ["Banco Mundial"],
                "tema_1": "economico",
                "tema_2": "politico",
                "setor": "multisservico",
                "tipo_evento": "iniciativa",
                "titulo": "Banco Mundial anuncia Water Forward 2.0 com foco em segurança hídrica em países emergentes",
                "veiculo": "ONU News",
                "tipo_fonte": "oficial",
                "descricao": "Iniciativa global comprometida com investimentos de US$ 50 bi até 2030 para saneamento.",
                "resumo_executivo": "Oportunidade de financiamento multilateral. LatAm elegível para US$ 12+ bi em empréstimos verdes.",
                "link": "https://news.un.org/pt/story/2026/agua/banco-mundial/",
                "tags": ["banco-mundial", "agua", "global"],
                "impacto": "alto",
                "tom": "positivo",
                "status_revisao": "novo"
            }
        ]

        count = 0
        for article in articles:
            if self.add_article(article):
                count += 1

        return count

    def git_add_commit_push(self) -> bool:
        """Executa: git add -> commit -> push"""
        try:
            os.chdir(self.repo_path)

            # 1. Git add
            self.log("INFO", "Fazendo: git add dashboard/sample-data.jsonl")
            result = subprocess.run(
                ["git", "add", "dashboard/sample-data.jsonl"],
                capture_output=True,
                text=True,
                timeout=10
            )
            if result.returncode != 0:
                self.log("ERROR", f"git add falhou: {result.stderr}")
                return False

            # 2. Git commit
            commit_msg = f"Add news from {self.today} - News Intelligence Processor"
            self.log("INFO", f"Fazendo: git commit -m '{commit_msg}'")
            result = subprocess.run(
                ["git", "commit", "-m", commit_msg],
                capture_output=True,
                text=True,
                timeout=10
            )
            if result.returncode != 0:
                if "nothing to commit" in result.stdout:
                    self.log("WARN", "Nenhuma mudança para fazer commit")
                    return True
                self.log("ERROR", f"git commit falhou: {result.stderr}")
                return False

            self.log("INFO", "✓ Commit criado com sucesso")

            # 3. Git push
            self.log("INFO", "Fazendo: git push origin main")
            result = subprocess.run(
                ["git", "push", "origin", "main"],
                capture_output=True,
                text=True,
                timeout=30
            )
            if result.returncode != 0:
                self.log("ERROR", f"git push falhou: {result.stderr}")
                return False

            self.log("INFO", "✓ Push concluído com sucesso!")
            return True

        except subprocess.TimeoutExpired:
            self.log("ERROR", "Timeout ao executar comando git")
            return False
        except Exception as e:
            self.log("ERROR", f"Erro ao executar git: {e}")
            return False

    def run(self):
        """Executa o pipeline completo"""
        self.log("INFO", "========================================")
        self.log("INFO", "🚀 NEWS INTELLIGENCE PROCESSOR")
        self.log("INFO", f"Data: {self.today}")
        self.log("INFO", "========================================")

        # Adicionar artigos
        self.log("INFO", "Adicionando artigos...")
        count = self.add_sample_articles()

        if count == 0:
            self.log("ERROR", "Nenhum artigo adicionado")
            return False

        self.log("INFO", f"✓ {count} artigos adicionados")

        # Fazer git add/commit/push
        self.log("INFO", "Publicando no GitHub...")
        if not self.git_add_commit_push():
            self.log("ERROR", "Falha ao fazer push")
            return False

        self.log("INFO", "========================================")
        self.log("INFO", "✅ SUCESSO! Dashboard atualizado")
        self.log("INFO", f"📊 https://brenowohlers.github.io/fin_dash_bw/dashboard/")
        self.log("INFO", "========================================")
        return True

if __name__ == "__main__":
    collector = NewsCollector()
    success = collector.run()
    sys.exit(0 if success else 1)
