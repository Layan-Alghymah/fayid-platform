import { Layout } from "@/components/Layout";
import { useState } from "react";
import { useLogin, useRegister } from "@workspace/api-client-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useLocation } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Mail, Lock, User, Building, Store } from "lucide-react";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState<'buyer' | 'supplier'>('buyer');
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '', email: '', password: '', businessName: ''
  });

  const handleSuccess = (data: any) => {
    if (data?.token) {
      localStorage.setItem("auth_token", data.token);
    }
    queryClient.invalidateQueries({ queryKey: [`/api/auth/me`] });
    const role = data?.user?.role;
    if (role === "supplier") {
      setLocation("/supplier");
    } else if (role === "admin") {
      setLocation("/admin");
    } else {
      setLocation("/");
    }
    toast({ title: "مرحباً بك!", description: "تم تسجيل الدخول بنجاح." });
  };

  const handleError = () => {
    toast({ variant: "destructive", title: "خطأ", description: "تأكد من البيانات المدخلة." });
  };

  const loginMut = useLogin({ mutation: { onSuccess: handleSuccess, onError: handleError } });
  const regMut = useRegister({ mutation: { onSuccess: handleSuccess, onError: handleError } });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      loginMut.mutate({ data: { email: formData.email, password: formData.password } });
    } else {
      regMut.mutate({ data: { ...formData, role } });
    }
  };

  return (
    <Layout>
      <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl mix-blend-screen" />
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-secondary/30 rounded-full blur-3xl mix-blend-screen" />
        </div>

        <div className="glass-panel w-full max-w-md p-8 rounded-3xl z-10 shadow-2xl border-white/10 relative">
          
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-foreground mb-2">
              {isLogin ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}
            </h1>
            <p className="text-muted-foreground">
              {isLogin ? 'مرحباً بعودتك لمنصة فائض' : 'انضم لأكبر منصة لفائض المنسوجات'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <>
                <div className="flex bg-black/20 p-1 rounded-xl mb-6">
                  <button
                    type="button"
                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${role === 'buyer' ? 'bg-primary text-primary-foreground shadow-md' : 'text-muted-foreground hover:text-foreground'}`}
                    onClick={() => setRole('buyer')}
                  >
                    مشتري
                  </button>
                  <button
                    type="button"
                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${role === 'supplier' ? 'bg-primary text-primary-foreground shadow-md' : 'text-muted-foreground hover:text-foreground'}`}
                    onClick={() => setRole('supplier')}
                  >
                    مورد / بائع
                  </button>
                </div>

                <div>
                  <Input 
                    placeholder="الاسم الكامل" 
                    icon={<User className="w-4 h-4" />}
                    required
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                
                {role === 'supplier' && (
                  <div>
                    <Input 
                      placeholder="اسم الشركة / المؤسسة" 
                      icon={<Building className="w-4 h-4" />}
                      required
                      value={formData.businessName}
                      onChange={e => setFormData({...formData, businessName: e.target.value})}
                    />
                  </div>
                )}
              </>
            )}

            <div>
              <Input 
                type="email" 
                placeholder="البريد الإلكتروني" 
                icon={<Mail className="w-4 h-4" />}
                required
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
            </div>
            
            <div>
              <Input 
                type="password" 
                placeholder="كلمة المرور" 
                icon={<Lock className="w-4 h-4" />}
                required
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 text-lg mt-4 shadow-primary/25"
              isLoading={loginMut.isPending || regMut.isPending}
            >
              {isLogin ? 'دخول' : 'تسجيل'}
            </Button>
          </form>

          <div className="mt-8 text-center text-sm text-muted-foreground">
            {isLogin ? 'ليس لديك حساب؟ ' : 'لديك حساب بالفعل؟ '}
            <button 
              onClick={() => setIsLogin(!isLogin)} 
              className="text-primary font-bold hover:underline"
            >
              {isLogin ? 'سجل الآن' : 'سجل دخول'}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
