"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Save,
  Loader2,
  RotateCcw,
  GripVertical,
  Eye,
  EyeOff,
  Paintbrush,
  Type,
  Image as ImageIcon,
  Sliders,
  Globe,
  Search,
  Settings2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ImageUploadField } from "@/components/image-upload-field";
import { LoginPreview } from "@/components/login-preview";
import {
  useSystemConfig,
  useUpdateSystemConfig,
  useUploadSystemImage,
} from "@/lib/queries/system-config";
import type { SystemConfigUpdate, FileUploadData } from "@/types/system-config";

interface ElementItem {
  id: string;
  label: string;
  visible: boolean;
}

interface PendingFile {
  file: File;
  preview: string;
  type: FileUploadData["type"];
}

const GRADIENT_DIRECTIONS = [
  { value: 135, label: "Diagonal direita", icon: "↘" },
  { value: 90, label: "Horizontal", icon: "→" },
  { value: 180, label: "Vertical", icon: "↓" },
  { value: 45, label: "Diagonal inverso", icon: "↗" },
  { value: 0, label: "Para cima", icon: "↑" },
  { value: 270, label: "Para esquerda", icon: "←" },
  { value: 225, label: "Diagonal esq.", icon: "↙" },
  { value: 315, label: "Diagonal esq. inv.", icon: "↖" },
];

export default function PersonalizationPage() {
  const { data: configResponse, isLoading } = useSystemConfig();
  const updateConfig = useUpdateSystemConfig();
  const uploadImage = useUploadSystemImage();

  const config = configResponse?.data;

  const [form, setForm] = useState<SystemConfigUpdate>({});
  const [pendingFiles, setPendingFiles] = useState<PendingFile[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  // Visual editor state
  const [elements, setElements] = useState<ElementItem[]>([
    { id: "logo", label: "Logo", visible: true },
    { id: "title", label: "Nome do Sistema", visible: true },
    { id: "subtitle", label: "Subtitulo", visible: true },
  ]);
  const [gradientDirection, setGradientDirection] = useState(135);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  useEffect(() => {
    if (config) {
      setForm({
        systemName: config.systemName,
        systemTitle: config.systemTitle,
        systemDescription: config.systemDescription || "",
        seoTitle: config.seoTitle || "",
        seoDescription: config.seoDescription || "",
        seoKeywords: config.seoKeywords || "",
        logoUrl: config.logoUrl || "",
        logoUrlDark: config.logoUrlDark || "",
        faviconUrl: config.faviconUrl || "",
        primaryColor: config.primaryColor || "#6366f1",
        secondaryColor: config.secondaryColor || "#8b5cf6",
        contactEmail: config.contactEmail || "",
        supportUrl: config.supportUrl || "",
        websiteUrl: config.websiteUrl || "",
        privacyPolicyUrl: config.privacyPolicyUrl || "",
        termsOfServiceUrl: config.termsOfServiceUrl || "",
        facebookUrl: config.facebookUrl || "",
        twitterUrl: config.twitterUrl || "",
        linkedinUrl: config.linkedinUrl || "",
        instagramUrl: config.instagramUrl || "",
        maintenanceMode: config.maintenanceMode,
        allowRegistration: config.allowRegistration,
      });
    }
  }, [config]);

  function updateField(
    field: keyof SystemConfigUpdate,
    value: string | boolean
  ) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleFileSelect(type: FileUploadData["type"], file: File) {
    const preview = URL.createObjectURL(file);
    setPendingFiles((prev) => {
      const filtered = prev.filter((p) => p.type !== type);
      return [...filtered, { file, preview, type }];
    });
  }

  function handleImageRemove(type: FileUploadData["type"]) {
    setPendingFiles((prev) => prev.filter((p) => p.type !== type));
    updateField(type, "");
  }

  function getPendingPreview(type: FileUploadData["type"]) {
    return pendingFiles.find((p) => p.type === type)?.preview;
  }

  function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // Drag and drop handlers
  function handleDragStart(index: number) {
    setDragIndex(index);
  }

  function handleDragOver(e: React.DragEvent, index: number) {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;
    const newElements = [...elements];
    const [removed] = newElements.splice(dragIndex, 1);
    newElements.splice(index, 0, removed);
    setElements(newElements);
    setDragIndex(index);
  }

  function handleDragEnd() {
    setDragIndex(null);
  }

  function toggleElementVisibility(id: string) {
    setElements((prev) =>
      prev.map((el) => (el.id === id ? { ...el, visible: !el.visible } : el))
    );
  }

  function resetForm() {
    if (config) {
      setForm({
        systemName: config.systemName,
        systemTitle: config.systemTitle,
        systemDescription: config.systemDescription || "",
        seoTitle: config.seoTitle || "",
        seoDescription: config.seoDescription || "",
        seoKeywords: config.seoKeywords || "",
        logoUrl: config.logoUrl || "",
        logoUrlDark: config.logoUrlDark || "",
        faviconUrl: config.faviconUrl || "",
        primaryColor: config.primaryColor || "#6366f1",
        secondaryColor: config.secondaryColor || "#8b5cf6",
        contactEmail: config.contactEmail || "",
        supportUrl: config.supportUrl || "",
        websiteUrl: config.websiteUrl || "",
        privacyPolicyUrl: config.privacyPolicyUrl || "",
        termsOfServiceUrl: config.termsOfServiceUrl || "",
        facebookUrl: config.facebookUrl || "",
        twitterUrl: config.twitterUrl || "",
        linkedinUrl: config.linkedinUrl || "",
        instagramUrl: config.instagramUrl || "",
        maintenanceMode: config.maintenanceMode,
        allowRegistration: config.allowRegistration,
      });
      pendingFiles.forEach((p) => URL.revokeObjectURL(p.preview));
      setPendingFiles([]);
      setElements([
        { id: "logo", label: "Logo", visible: true },
        { id: "title", label: "Nome do Sistema", visible: true },
        { id: "subtitle", label: "Subtitulo", visible: true },
      ]);
      setGradientDirection(135);
    }
  }

  async function handleSave() {
    setIsSaving(true);
    try {
      for (const pending of pendingFiles) {
        const base64 = await fileToBase64(pending.file);
        await uploadImage.mutateAsync({
          type: pending.type,
          base64,
          filename: pending.file.name,
        });
      }

      const fieldsToUpdate = { ...form };
      for (const pending of pendingFiles) {
        delete fieldsToUpdate[pending.type];
      }

      await updateConfig.mutateAsync(fieldsToUpdate);

      pendingFiles.forEach((p) => URL.revokeObjectURL(p.preview));
      setPendingFiles([]);
      toast.success("Configuracoes salvas com sucesso!");
    } catch {
      toast.error("Erro ao salvar configuracoes.");
    } finally {
      setIsSaving(false);
    }
  }

  // Get logo URL for preview (pending upload takes priority)
  const previewLogoUrl = getPendingPreview("logoUrl") || form.logoUrl || "";

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Personalizacao do Sistema</h1>
          <p className="text-muted-foreground">Carregando configuracoes...</p>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-96 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Personalizacao do Sistema</h1>
          <p className="text-sm text-muted-foreground">
            Editor visual com preview em tempo real.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={resetForm}
            disabled={isSaving}
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Resetar
          </Button>
          <Button size="sm" onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Salvar
          </Button>
        </div>
      </div>

      <Tabs defaultValue="editor" className="space-y-4">
        <TabsList>
          <TabsTrigger value="editor">
            <Paintbrush className="mr-2 h-4 w-4" />
            Editor Visual
          </TabsTrigger>
          <TabsTrigger value="seo">
            <Search className="mr-2 h-4 w-4" />
            SEO
          </TabsTrigger>
          <TabsTrigger value="links">
            <Globe className="mr-2 h-4 w-4" />
            Links
          </TabsTrigger>
          <TabsTrigger value="advanced">
            <Settings2 className="mr-2 h-4 w-4" />
            Avancado
          </TabsTrigger>
        </TabsList>

        {/* ======================== EDITOR VISUAL ======================== */}
        <TabsContent value="editor">
          <div className="flex gap-6 items-start">
            {/* Left: Controls */}
            <div className="w-[380px] shrink-0 space-y-4">
              {/* Elementos - Drag & Drop */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Sliders className="h-4 w-4" />
                    Ordem dos Elementos
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Arraste para reordenar. Clique no olho para mostrar/ocultar.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-1">
                  {elements.map((el, index) => (
                    <div
                      key={el.id}
                      draggable
                      onDragStart={() => handleDragStart(index)}
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDragEnd={handleDragEnd}
                      className={`flex items-center gap-2 rounded-md border px-3 py-2 transition-all cursor-grab active:cursor-grabbing ${
                        dragIndex === index
                          ? "border-primary bg-primary/5 shadow-sm"
                          : "border-border hover:bg-muted/50"
                      } ${!el.visible ? "opacity-50" : ""}`}
                    >
                      <GripVertical className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span className="text-sm flex-1">{el.label}</span>
                      <button
                        type="button"
                        onClick={() => toggleElementVisibility(el.id)}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {el.visible ? (
                          <Eye className="h-4 w-4" />
                        ) : (
                          <EyeOff className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Cores */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Paintbrush className="h-4 w-4" />
                    Cores
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs">Primaria</Label>
                      <div className="flex gap-1.5">
                        <input
                          type="color"
                          value={form.primaryColor || "#6366f1"}
                          onChange={(e) =>
                            updateField("primaryColor", e.target.value)
                          }
                          className="h-9 w-10 cursor-pointer rounded border p-0.5"
                        />
                        <Input
                          value={form.primaryColor || ""}
                          onChange={(e) =>
                            updateField("primaryColor", e.target.value)
                          }
                          placeholder="#6366f1"
                          className="h-9 text-xs flex-1"
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Secundaria</Label>
                      <div className="flex gap-1.5">
                        <input
                          type="color"
                          value={form.secondaryColor || "#8b5cf6"}
                          onChange={(e) =>
                            updateField("secondaryColor", e.target.value)
                          }
                          className="h-9 w-10 cursor-pointer rounded border p-0.5"
                        />
                        <Input
                          value={form.secondaryColor || ""}
                          onChange={(e) =>
                            updateField("secondaryColor", e.target.value)
                          }
                          placeholder="#8b5cf6"
                          className="h-9 text-xs flex-1"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Gradient direction picker */}
                  <div className="space-y-1.5">
                    <Label className="text-xs">Direcao do Gradiente</Label>
                    <div className="grid grid-cols-4 gap-1.5">
                      {GRADIENT_DIRECTIONS.map((dir) => (
                        <button
                          key={dir.value}
                          type="button"
                          onClick={() => setGradientDirection(dir.value)}
                          className={`flex flex-col items-center gap-0.5 rounded-md border p-2 text-xs transition-all ${
                            gradientDirection === dir.value
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-border hover:bg-muted/50 text-muted-foreground"
                          }`}
                        >
                          <span className="text-lg leading-none">
                            {dir.icon}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Gradient preview bar */}
                  <div
                    className="h-6 rounded-md border"
                    style={{
                      background: `linear-gradient(${gradientDirection}deg, ${form.primaryColor || "#6366f1"}, ${form.secondaryColor || "#8b5cf6"})`,
                    }}
                  />
                </CardContent>
              </Card>

              {/* Textos */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Type className="h-4 w-4" />
                    Textos
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Nome do Sistema</Label>
                    <Input
                      value={form.systemName || ""}
                      onChange={(e) =>
                        updateField("systemName", e.target.value)
                      }
                      placeholder="William SDR"
                      className="h-9 text-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Titulo / Subtitulo</Label>
                    <Input
                      value={form.systemTitle || ""}
                      onChange={(e) =>
                        updateField("systemTitle", e.target.value)
                      }
                      placeholder="Faca login para acessar o painel"
                      className="h-9 text-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Descricao</Label>
                    <Textarea
                      value={form.systemDescription || ""}
                      onChange={(e) =>
                        updateField("systemDescription", e.target.value)
                      }
                      placeholder="Descricao do sistema..."
                      rows={2}
                      className="text-xs"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Logos */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <ImageIcon className="h-4 w-4" />
                    Imagens
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-3">
                    <ImageUploadField
                      label="Logo"
                      currentValue={form.logoUrl}
                      pendingPreview={getPendingPreview("logoUrl")}
                      onFileSelect={(file) =>
                        handleFileSelect("logoUrl", file)
                      }
                      onRemove={() => handleImageRemove("logoUrl")}
                      onUrlChange={(url) => updateField("logoUrl", url)}
                    />
                    <ImageUploadField
                      label="Logo Dark"
                      currentValue={form.logoUrlDark}
                      pendingPreview={getPendingPreview("logoUrlDark")}
                      onFileSelect={(file) =>
                        handleFileSelect("logoUrlDark", file)
                      }
                      onRemove={() => handleImageRemove("logoUrlDark")}
                      onUrlChange={(url) => updateField("logoUrlDark", url)}
                    />
                    <ImageUploadField
                      label="Favicon"
                      currentValue={form.faviconUrl}
                      pendingPreview={getPendingPreview("faviconUrl")}
                      onFileSelect={(file) =>
                        handleFileSelect("faviconUrl", file)
                      }
                      onRemove={() => handleImageRemove("faviconUrl")}
                      onUrlChange={(url) => updateField("faviconUrl", url)}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right: Live Preview */}
            <div className="flex-1 flex flex-col items-center gap-4 sticky top-4">
              <div className="text-xs text-muted-foreground font-medium">
                Preview em tempo real
              </div>
              <LoginPreview
                systemName={form.systemName || ""}
                systemTitle={form.systemTitle || ""}
                logoUrl={previewLogoUrl}
                primaryColor={form.primaryColor || "#6366f1"}
                secondaryColor={form.secondaryColor || "#8b5cf6"}
                gradientDirection={gradientDirection}
                elements={elements}
              />
              <p className="text-[10px] text-muted-foreground text-center max-w-[300px]">
                As alteracoes de cores, textos e logos serao aplicadas na tela de
                login do sistema em tempo real apos salvar.
              </p>
            </div>
          </div>
        </TabsContent>

        {/* ======================== SEO ======================== */}
        <TabsContent value="seo">
          <Card>
            <CardHeader>
              <CardTitle>Otimizacao para Buscadores (SEO)</CardTitle>
              <CardDescription>
                Configuracoes de SEO para melhorar a visibilidade nos mecanismos
                de busca.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="seoTitle">Titulo SEO</Label>
                <Input
                  id="seoTitle"
                  value={form.seoTitle || ""}
                  onChange={(e) => updateField("seoTitle", e.target.value)}
                  placeholder="Titulo para mecanismos de busca"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="seoDescription">Descricao SEO</Label>
                <Textarea
                  id="seoDescription"
                  value={form.seoDescription || ""}
                  onChange={(e) =>
                    updateField("seoDescription", e.target.value)
                  }
                  placeholder="Descricao para mecanismos de busca (max 160 caracteres)"
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">
                  {(form.seoDescription || "").length}/160 caracteres
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="seoKeywords">Palavras-chave</Label>
                <Input
                  id="seoKeywords"
                  value={form.seoKeywords || ""}
                  onChange={(e) => updateField("seoKeywords", e.target.value)}
                  placeholder="vendas, sdr, automacao, leads"
                />
                <p className="text-xs text-muted-foreground">
                  Separadas por virgula.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ======================== LINKS ======================== */}
        <TabsContent value="links">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Contato e Links Institucionais</CardTitle>
                <CardDescription>
                  Links de contato, suporte e politicas.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="contactEmail">Email de Contato</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      value={form.contactEmail || ""}
                      onChange={(e) =>
                        updateField("contactEmail", e.target.value)
                      }
                      placeholder="contato@exemplo.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="websiteUrl">Website</Label>
                    <Input
                      id="websiteUrl"
                      value={form.websiteUrl || ""}
                      onChange={(e) =>
                        updateField("websiteUrl", e.target.value)
                      }
                      placeholder="https://exemplo.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="supportUrl">URL de Suporte</Label>
                    <Input
                      id="supportUrl"
                      value={form.supportUrl || ""}
                      onChange={(e) =>
                        updateField("supportUrl", e.target.value)
                      }
                      placeholder="https://suporte.exemplo.com"
                    />
                  </div>
                </div>
                <Separator />
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="privacyPolicyUrl">
                      Politica de Privacidade
                    </Label>
                    <Input
                      id="privacyPolicyUrl"
                      value={form.privacyPolicyUrl || ""}
                      onChange={(e) =>
                        updateField("privacyPolicyUrl", e.target.value)
                      }
                      placeholder="https://exemplo.com/privacidade"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="termsOfServiceUrl">
                      Termos de Servico
                    </Label>
                    <Input
                      id="termsOfServiceUrl"
                      value={form.termsOfServiceUrl || ""}
                      onChange={(e) =>
                        updateField("termsOfServiceUrl", e.target.value)
                      }
                      placeholder="https://exemplo.com/termos"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Redes Sociais</CardTitle>
                <CardDescription>
                  Links das redes sociais da empresa.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="facebookUrl">Facebook</Label>
                    <Input
                      id="facebookUrl"
                      value={form.facebookUrl || ""}
                      onChange={(e) =>
                        updateField("facebookUrl", e.target.value)
                      }
                      placeholder="https://facebook.com/empresa"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="instagramUrl">Instagram</Label>
                    <Input
                      id="instagramUrl"
                      value={form.instagramUrl || ""}
                      onChange={(e) =>
                        updateField("instagramUrl", e.target.value)
                      }
                      placeholder="https://instagram.com/empresa"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="linkedinUrl">LinkedIn</Label>
                    <Input
                      id="linkedinUrl"
                      value={form.linkedinUrl || ""}
                      onChange={(e) =>
                        updateField("linkedinUrl", e.target.value)
                      }
                      placeholder="https://linkedin.com/company/empresa"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="twitterUrl">Twitter / X</Label>
                    <Input
                      id="twitterUrl"
                      value={form.twitterUrl || ""}
                      onChange={(e) =>
                        updateField("twitterUrl", e.target.value)
                      }
                      placeholder="https://x.com/empresa"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ======================== AVANCADO ======================== */}
        <TabsContent value="advanced">
          <Card>
            <CardHeader>
              <CardTitle>Configuracoes Avancadas</CardTitle>
              <CardDescription>
                Modo de manutencao e controle de registro.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Modo Manutencao</Label>
                  <p className="text-sm text-muted-foreground">
                    Quando ativado, exibe uma tela de manutencao para os
                    usuarios.
                  </p>
                </div>
                <Switch
                  checked={form.maintenanceMode || false}
                  onCheckedChange={(checked) =>
                    updateField("maintenanceMode", checked)
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Permitir Registro</Label>
                  <p className="text-sm text-muted-foreground">
                    Permite que novos usuarios se registrem na plataforma.
                  </p>
                </div>
                <Switch
                  checked={form.allowRegistration || false}
                  onCheckedChange={(checked) =>
                    updateField("allowRegistration", checked)
                  }
                />
              </div>
              <Separator />
              <div className="space-y-2">
                <Label htmlFor="version">Versao</Label>
                <Input
                  id="version"
                  value={form.version || ""}
                  onChange={(e) => updateField("version", e.target.value)}
                  placeholder="1.0.0"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
