"use Link"
import { ChevronRight } from "lucide-react"
import { usePathname } from "next/navigation"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage
} from "@/components/ui/breadcrumb"
import Link from "next/link";


export default function BreadcrumbPaginaAtual() {
    const caminhoAtual = usePathname();
    const caminhoSegmentos = caminhoAtual
        .split("/")
        .filter(Boolean)
        .slice(1)
        // Remove ids numéricos do breadcrumb (exceto se for o único segmento)
        .filter((seg, idx, arr) => !(arr.length > 1 && /^\d+$/.test(seg)));

    const nomesCorrigidos: Record<string, string> = {
        "usuarios": "Usuários",
        "veiculos": "Veículos",
        "permissoes": "Permissões",
        "funcoes": "Funções",
        "configuracoes": "Configurações",
        "meus-checklists": "Meus Checklists",
        "modelos-checklists": "Modelos de Checklists",
        "todos-checklists": "Todos os Checklists",
        "itens-checklist": "Itens de Checklist",
    };

    return (
        <Breadcrumb className="hidden lg:block">
            <BreadcrumbList className="flex space-x-2 text-sm">
                <BreadcrumbItem>
                    <Link href="/" className="text-base text-gray-450 font-semibold dark:text-white">Início</Link>
                </BreadcrumbItem>

                {caminhoSegmentos.map((segmento, index) => {
                        const nomeCorrigido = nomesCorrigidos[segmento] || segmento.charAt(0).toUpperCase() + segmento.slice(1).toLowerCase();
                        const href = caminhoSegmentos.slice(0, index + 1).join("/"); 
                        const isUltimo = index === caminhoSegmentos.length - 1;
                        const isChecklists = segmento.toLowerCase() === 'checklists'; 
                        
                        return (
                            <div key={index} className="flex items-center space-x-2">
                                <ChevronRight className="h-4 w-4 dark:text-white" />
                                {isUltimo ? (
                                    <BreadcrumbItem>
                                        <BreadcrumbPage className="text-base text-gray-500 font-bold dark:text-white">
                                            {nomeCorrigido}
                                        </BreadcrumbPage>
                                    </BreadcrumbItem>
                                ) : (
                                    <BreadcrumbItem>
                                        {isChecklists ? (
                                            <span className="text-base text-gray-450 font-semibold dark:text-white">
                                                {nomeCorrigido}
                                            </span>
                                        ) : (
                                            <Link className="text-base text-gray-450 font-semibold dark:text-white" href={href}>
                                                {nomeCorrigido}
                                            </Link>
                                        )}
                                    </BreadcrumbItem>
                                )}
                            </div>
                        );
                    })}
            </BreadcrumbList>
        </Breadcrumb>
    );
}

