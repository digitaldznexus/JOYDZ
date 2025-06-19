import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertContactMessageSchema } from "@shared/schema";

const contactFormSchema = insertContactMessageSchema.extend({
  prenom: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  nom: z.string().min(2, "Le nom doit contenir au moins 2 caractères"), 
  email: z.string().email("Veuillez saisir une adresse email valide"),
  telephone: z.string().optional(),
  sujet: z.string().min(1, "Veuillez sélectionner un sujet"),
  message: z.string().min(10, "Le message doit contenir au moins 10 caractères"),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      prenom: "",
      nom: "",
      email: "",
      telephone: "",
      sujet: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    try {
      await apiRequest("POST", "/api/contact", data);
      
      toast({
        title: "Message envoyé",
        description: "Merci pour votre message. Nous vous répondrons dans les plus brefs délais.",
      });
      
      form.reset();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de l'envoi du message. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: "Adresse",
      content: ["Yaghmoracen Fernand ville akid belle vue", "Oran, Algeria, 31000"],
    },
    {
      icon: Phone,
      title: "Téléphone",
      content: ["0561 84 20 26"],
    },
    {
      icon: Mail,
      title: "Email",
      content: ["joyfamilleoran@gmail.com"],
    },
    {
      icon: Clock,
      title: "Horaires",
      content: ["Lundi - Samedi: 9h00 - 19h00", "Dimanche: 10h00 - 17h00"],
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-[Abril_Fatface] text-4xl md:text-5xl text-gray-900 mb-6">
            Contact
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto font-light">
            Notre équipe est à votre disposition pour vous accompagner dans votre expérience JOY.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="font-[Abril_Fatface] text-2xl text-gray-900 mb-8">
                Informations
              </h2>
              <p className="text-gray-600 font-light leading-relaxed mb-8">
                Découvrez l'univers JOY dans notre boutique d'Oran ou contactez-nous pour toute question 
                concernant nos collections, nos services ou pour prendre rendez-vous.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {contactInfo.map((item, index) => (
                <Card key={index} className="border-gray-100 hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 p-2 bg-yellow-100 rounded-lg">
                        <item.icon className="h-5 w-5 text-yellow-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 mb-2">
                          {item.title}
                        </h3>
                        <div className="space-y-1">
                          {item.content.map((line, lineIndex) => (
                            <p key={lineIndex} className="text-gray-600 text-sm font-light">
                              {line}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Additional Information */}
            <Card className="border-yellow-200 bg-yellow-50">
              <CardContent className="p-6">
                <h3 className="font-medium text-gray-900 mb-3">
                  Rendez-vous personnalisé
                </h3>
                <p className="text-gray-700 text-sm font-light leading-relaxed">
                  Pour une expérience sur-mesure, nous vous proposons des consultations privées dans notre atelier. 
                  Contactez-nous pour planifier votre rendez-vous et découvrir nos créations en exclusivité.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="font-[Abril_Fatface] text-2xl text-gray-900">
                  Nous Contacter
                </CardTitle>
                <p className="text-gray-600 font-light">
                  Remplissez ce formulaire et nous vous répondrons rapidement.
                </p>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="prenom"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Prénom *</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Votre prénom" 
                                className="bg-gray-50 border-gray-200 focus:border-yellow-600 focus:ring-yellow-600"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="nom"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nom *</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Votre nom" 
                                className="bg-gray-50 border-gray-200 focus:border-yellow-600 focus:ring-yellow-600"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email *</FormLabel>
                          <FormControl>
                            <Input 
                              type="email" 
                              placeholder="votre.email@exemple.com" 
                              className="bg-gray-50 border-gray-200 focus:border-yellow-600 focus:ring-yellow-600"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="telephone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Téléphone</FormLabel>
                          <FormControl>
                            <Input 
                              type="tel" 
                              placeholder="Votre numéro de téléphone" 
                              className="bg-gray-50 border-gray-200 focus:border-yellow-600 focus:ring-yellow-600"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="sujet"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sujet *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-gray-50 border-gray-200 focus:border-yellow-600 focus:ring-yellow-600">
                                <SelectValue placeholder="Sélectionnez un sujet" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="commande">Question sur une commande</SelectItem>
                              <SelectItem value="produit">Information produit</SelectItem>
                              <SelectItem value="rendez-vous">Prise de rendez-vous</SelectItem>
                              <SelectItem value="retour">Retour/Échange</SelectItem>
                              <SelectItem value="partenariat">Partenariat</SelectItem>
                              <SelectItem value="autre">Autre</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Message *</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Décrivez votre demande en détail..."
                              className="bg-gray-50 border-gray-200 focus:border-yellow-600 focus:ring-yellow-600 min-h-[120px] resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      size="lg"
                      disabled={isSubmitting}
                      className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-medium tracking-wide"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                          Envoi en cours...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Envoyer le Message
                        </>
                      )}
                    </Button>

                    <p className="text-xs text-gray-500 text-center">
                      En soumettant ce formulaire, vous acceptez que JOY traite vos données personnelles 
                      pour répondre à votre demande.
                    </p>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Additional Services */}
        <div className="mt-20 bg-gray-50 rounded-2xl p-8 md:p-12">
          <div className="text-center mb-12">
            <h2 className="font-[Abril_Fatface] text-3xl text-gray-900 mb-4">
              Services Exclusifs
            </h2>
            <p className="text-gray-600 font-light max-w-2xl mx-auto">
              Découvrez nos services premium pour une expérience JOY exceptionnelle.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="font-medium text-gray-900 mb-2">Conseil Personnalisé</h3>
              <p className="text-gray-600 text-sm font-light">
                Nos stylistes vous accompagnent dans le choix de vos pièces pour créer le look parfait.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="font-medium text-gray-900 mb-2">Livraison Premium</h3>
              <p className="text-gray-600 text-sm font-light">
                Service de livraison soignée avec emballage luxe pour préserver l'excellence de vos achats.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="font-medium text-gray-900 mb-2">SAV d'Excellence</h3>
              <p className="text-gray-600 text-sm font-light">
                Service après-vente dédié pour l'entretien et les retouches de vos pièces JOY.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
