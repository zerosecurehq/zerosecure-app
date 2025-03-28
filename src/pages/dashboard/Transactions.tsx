import Signing from "../../components/dashboard/transactions/Signing";
import History from "../../components/dashboard/transactions/History";
import Executing from "@/components/dashboard/transactions/Executing";
import Warning from "@/components/ui/Warning";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";

const Transactions = () => {
  return (
    <section className="bg-gray-100 w-full px-28">
      <div className="p-4">
        <Warning
          msg={
            "Do not directly send aleo credits to multisig address because it is virtual and not exit in the blockchain."
          }
        />
      </div>
      <div className="pt-6 pl-6 pr-6">
        <h2 className="font-bold text-4xl mb-3">Transactions</h2>
        <Tabs defaultValue="signing">
          <div className="flex items-center justify-between gap-2 mb-8">
            <TabsList className="grid w-[400px] grid-cols-3 space-x-3 bg-gray-200">
              <TabsTrigger value="signing">
                Signing
              </TabsTrigger>
              <TabsTrigger value="excute">
                Excute
              </TabsTrigger>
              <TabsTrigger value="history">
                History
              </TabsTrigger>
            </TabsList>
            <div className="flex items-center gap-4">
              <div className="flex items-center space-x-2">
                <Switch id="hideSuspicious" />
                <Label htmlFor="hideSuspicious">Hide Suspicious</Label>
              </div>
              <Select>
                <SelectTrigger className="w-fit">
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <TabsContent value="signing">
            <Card>
              <CardContent className="space-y-2">
                <Signing />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="excute">
            <Card>
              <CardContent className="space-y-2">
                <Executing />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="history">
            <Card>
              <CardContent className="space-y-2">
                <History />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default Transactions;
