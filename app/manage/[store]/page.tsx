"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";

import {
  ArrowLeft,
  Camera,
  CheckCircle,
  FolderTree,
  ImageIcon,
  LayoutDashboard,
  MapPin,
  Package,
  PlusCircle,
  Upload,
  Wrench,
  XCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DialogContent,
  Dialog,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import SortableList, { Item } from "./components/sortable-list";
import { CommentRatings } from "./components/rating";
import StatusButton from "./components/status-button";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { show } from "@/redux/slices/store";

export default function Store() {
  const { store } = useParams();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const addressInRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    dispatch(show(store as string));
  }, []);

  const loading = useSelector((state: RootState) => state.store.loading);
  const data = useSelector((state: RootState) => state.store.data);

  const [focusAddress, setFocusAddress] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("categories");
  const [selectedCategory, setSelectedCategory] = useState<Item | null>(null);

  const handleCategoryClick = (item: Item) => {
    setSelectedCategory(item);
    setActiveTab("items");
  };

  const handleBack = () => {
    setSelectedCategory(null);
    setActiveTab("categories");
  };

  return (
    <div className="space-y-4 p-4 md:p-6">
      <div className="flex items-center justify-between space-y-2">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Loja</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {!loading && data ? (
        <>
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Informações Básicas</CardTitle>
                <CardDescription>
                  Gerencie as informações principais da loja
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="relative h-[190px] md:h-[190px] w-full rounded-lg overflow-hidden">
                  {data.bannerUrl ? (
                    <Image
                      src={data?.bannerUrl}
                      alt={data.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center border rounded-lg text-muted-foreground">
                      Nenhum banner definido
                    </div>
                  )}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="absolute bottom-4 right-4"
                      >
                        <Camera className="mr-2 h-4 w-4" />
                        Alterar Banner
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Alterar Imagem do Banner</DialogTitle>
                        <DialogDescription>
                          Escolha uma nova imagem do banner para a loja
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label>Imagem do Banner</Label>
                          <Input id="cover" type="file" accept="image/*" />
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="flex items-center gap-4">
                  <div className="relative w-[90px] h-[90px] ">
                    {data.photoUrl ? (
                      <Image
                        src={data.photoUrl}
                        alt={data.name}
                        width={90}
                        height={90}
                        className="w-full h-full rounded-lg object-contain"
                      />
                    ) : (
                      <ImageIcon
                        strokeWidth={0.5}
                        className="w-full h-full  text-muted-foreground"
                      />
                    )}

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="secondary"
                          size="sm"
                          className="absolute -bottom-2 -right-2"
                        >
                          <Upload className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Alterar Logo</DialogTitle>
                          <DialogDescription>
                            Escolha uma nova logo para a loja
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid gap-2">
                            <Label>Logo</Label>
                            <Input id="logo" type="file" accept="image/*" />
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>

                  <div className="flex gap-2 flex-col">
                    <Dialog>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1">
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              className="py-0 px-2 h-auto font-bold text-xl"
                              onClick={() => setFocusAddress(false)}
                            >
                              {data.name}
                            </Button>
                          </DialogTrigger>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <StatusButton status={data.status} />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem>
                                <CheckCircle className="h-4 w-4 text-green-600" />
                                Aberto
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <XCircle className="h-4 w-4 text-red-600" />
                                Fechado
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Wrench className="h-4 w-4 text-yellow-600" />
                                Em Manutenção
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            className="py-0 px-2 h-auto flex items-center text-muted-foreground"
                            onClick={() => setFocusAddress(true)}
                          >
                            <MapPin className="h-4 w-4" />
                            {data.address
                              ? data.address
                              : "Endereço não definido"}
                          </Button>
                        </DialogTrigger>
                      </div>

                      <DialogContent
                        onOpenAutoFocus={(e) => {
                          if (focusAddress) {
                            e.preventDefault();
                            addressInRef.current?.focus();
                            addressInRef.current?.select();
                          }
                        }}
                      >
                        <DialogHeader>
                          <DialogTitle>Editar Informações da Loja</DialogTitle>
                          <DialogDescription>
                            Atualize as informações básicas da sua loja
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid gap-2">
                            <Label htmlFor="name">Nome da Loja</Label>
                            <Input id="name" defaultValue="JJ Pastéis" />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="address">Endereço</Label>
                            <Input
                              ref={addressInRef}
                              id="address"
                              defaultValue="Praia do Boqueirão - Santos / SP"
                            />
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <div className="ps-2">
                      <CommentRatings
                        rating={5}
                        totalStars={5}
                        size={18}
                        variant="yellow"
                        precision={0.1}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Categorias e Produtos</CardTitle>
                <CardDescription>
                  Organize e ordene as categorias e produtos
                </CardDescription>
              </CardHeader>
              <CardContent className="px-6 py-0">
                <Tabs value={activeTab} className="w-full">
                  <TabsList className="w-full cursor-not-allowed">
                    <TabsTrigger
                      value="categories"
                      className="flex-1 cursor-not-allowed"
                    >
                      Categorias
                    </TabsTrigger>
                    <TabsTrigger
                      value="items"
                      className="flex-1 cursor-not-allowed "
                    >
                      Produtos
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="categories">
                    <ScrollArea className="h-[258px] pr-4 pb-0 mb-6 md:mb-0 pt-1">
                      <SortableList
                        items={[
                          { id: 1, name: "Pastéis Simples" },
                          { id: 2, name: "Pastéis Especiais" },
                          { id: 3, name: "Pastéis Selecionados" },
                          { id: 4, name: "Pastéis Doces" },
                          { id: 5, name: "Porções" },
                          { id: 6, name: "Bebidas" },
                        ]}
                        itemButton={
                          <Button variant="ghost">Ver produtos</Button>
                        }
                        onItemClick={(item) => handleCategoryClick(item)}
                      />
                    </ScrollArea>
                  </TabsContent>
                  <TabsContent value="items">
                    <ScrollArea className="h-[258px] pr-4 py-0">
                      <div className="flex items-center justify-between pb-2 sticky top-0 bg-background z-20">
                        <CardTitle>{selectedCategory?.name}</CardTitle>
                        <Button variant="ghost" size="sm" onClick={handleBack}>
                          <ArrowLeft className="mr-1 h-4 w-4" />
                          Voltar
                        </Button>
                      </div>

                      <SortableList
                        items={[
                          { id: 1, name: "Pastel de Palmito" },
                          { id: 2, name: "Pastel de Palmito" },
                          { id: 3, name: "Pastel de Catupiry" },
                          { id: 4, name: "Pastel de Vegetariano" },
                          { id: 5, name: "Pastel de Chocolate" },
                          { id: 6, name: "Pastel de Palmito" },
                          { id: 7, name: "Pastel de Presunto e Queijo" },
                          { id: 8, name: "Pastel de Calabresa" },
                          { id: 9, name: "Pastel de Queijo" },
                          { id: 10, name: "Pastel de Pizza" },
                          { id: 11, name: "Pastel de Frango" },
                          { id: 12, name: "Pastel de Pizza" },
                          { id: 13, name: "Pastel de Carne" },
                          { id: 14, name: "Pastel de Vegetariano" },
                          { id: 15, name: "Pastel de Calabresa" },
                        ]}
                      />
                    </ScrollArea>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Acessos Rápidos</CardTitle>
              <CardDescription>
                Acesse rapidamente outras seções importantes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button
                  className="h-24 flex flex-col items-center justify-center"
                  onClick={() => router.push(`/manage/${store}/overview`)}
                >
                  <LayoutDashboard className="w-6 h-6 mb-2" />
                  Visão Geral
                </Button>
                <Button
                  className="h-24 flex flex-col items-center justify-center"
                  onClick={() => router.push(`/manage/${store}/categories`)}
                >
                  <FolderTree className="w-6 h-6 mb-2" />
                  Categorias
                </Button>
                <Button
                  className="h-24 flex flex-col items-center justify-center"
                  onClick={() => router.push(`/manage/${store}/items`)}
                >
                  <Package className="w-6 h-6 mb-2" />
                  Items
                </Button>
                <Button
                  className="h-24 flex flex-col items-center justify-center"
                  onClick={() => router.push(`/manage/${store}/addons`)}
                >
                  <PlusCircle className="w-6 h-6 mb-2" />
                  Adicionais
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        <div>Carregando</div>
      )}
    </div>
  );
}
