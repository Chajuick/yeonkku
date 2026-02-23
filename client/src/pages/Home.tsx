import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import VcfImporter from "@/components/VcfImporter";
import ContactsTable from "@/components/ContactsTable";
import PrefixSuffixManager from "@/components/PrefixSuffixManager";
import BatchActionsBar from "@/components/BatchActionsBar";
import ExportButton from "@/components/ExportButton";
import ConfirmModal from "@/components/ConfirmModal";
import { useIndexedDBState } from "@/hooks/useIndexedDBState";
import { batchApplyPrefixSuffix } from "@/lib/batchApply";
import { Contact, PrefixSuffixItem } from "@/../../shared/types";
import { Settings, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { i18n } from "@/lib/i18n";

/**
 * Main Home Page Component
 * Orchestrates all features: import, edit, manage prefixes/suffixes, batch apply, export
 */
export default function Home() {
  const { state, updateState, resetState, isLoading } = useIndexedDBState();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [prefixSeparator, setPrefixSeparator] = useState(state.settings.prefixSeparator);
  const [suffixSeparator, setSuffixSeparator] = useState(state.settings.suffixSeparator);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">로딩 중...</p>
      </div>
    );
  }

  // Handle import
  const handleImport = (contacts: Contact[]) => {
    updateState({
      contacts: [...state.contacts, ...contacts],
    });
    setSelectedIds(new Set());
  };

  // Handle contact update
  const handleContactUpdate = (contact: Contact) => {
    updateState({
      contacts: state.contacts.map((c) => (c.id === contact.id ? contact : c)),
    });
  };

  // Handle contact delete
  const handleContactDelete = (id: string) => {
    updateState({
      contacts: state.contacts.filter((c) => c.id !== id),
    });
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  };

  // Handle prefix list change
  const handlePrefixChange = (prefixes: PrefixSuffixItem[]) => {
    updateState({
      prefixList: prefixes,
    });
  };

  // Handle suffix list change
  const handleSuffixChange = (suffixes: PrefixSuffixItem[]) => {
    updateState({
      suffixList: suffixes,
    });
  };

  // Handle batch apply
  const handleBatchApply = (action: "add" | "remove") => {
    const updated = batchApplyPrefixSuffix(
      state.contacts,
      selectedIds,
      state.prefixList,
      state.suffixList,
      action,
      {
        ...state.settings,
        prefixSeparator,
        suffixSeparator,
      }
    );

    updateState({ contacts: updated });
    toast.success(
      `${selectedIds.size}개 연락처에 ${action === "add" ? "적용" : "제거"}되었습니다`
    );
  };

  // Handle settings update
  const handleSettingsUpdate = () => {
    updateState({
      settings: {
        ...state.settings,
        prefixSeparator,
        suffixSeparator,
      },
    });
    toast.success(i18n.settingsSaved);
  };

  // Handle reset
  const handleReset = async () => {
    await resetState();
    setSelectedIds(new Set());
    setConfirmOpen(false);
    toast.success("모든 데이터가 삭제되었습니다");
  };

  // Toggle prefix enabled
  const togglePrefixEnabled = (id: string) => {
    const updated = state.prefixList.map((p) =>
      p.id === id ? { ...p, enabled: !p.enabled } : p
    );
    handlePrefixChange(updated);
  };

  // Toggle suffix enabled
  const toggleSuffixEnabled = (id: string) => {
    const updated = state.suffixList.map((s) =>
      s.id === id ? { ...s, enabled: !s.enabled } : s
    );
    handleSuffixChange(updated);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 py-8">
      <div className="max-w-7xl mx-auto px-4 space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">{i18n.appTitle}</h1>
          <p className="text-lg text-muted-foreground">{i18n.appSubtitle}</p>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="contacts" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="contacts">{i18n.tabContacts}</TabsTrigger>
            <TabsTrigger value="prefixsuffix">{i18n.tabPrefixSuffix}</TabsTrigger>
            <TabsTrigger value="settings">{i18n.tabSettings}</TabsTrigger>
            <TabsTrigger value="export">{i18n.tabExport}</TabsTrigger>
          </TabsList>

          {/* Contacts Tab */}
          <TabsContent value="contacts" className="space-y-6">
            {state.contacts.length === 0 ? (
              <VcfImporter onImport={handleImport} />
            ) : (
              <>
                <ContactsTable
                  contacts={state.contacts}
                  selectedIds={selectedIds}
                  onSelectionChange={setSelectedIds}
                  onContactUpdate={handleContactUpdate}
                  onContactDelete={handleContactDelete}
                />
                <BatchActionsBar
                  selectedCount={selectedIds.size}
                  prefixList={state.prefixList}
                  suffixList={state.suffixList}
                  onApplyAdd={() => handleBatchApply("add")}
                  onApplyRemove={() => handleBatchApply("remove")}
                  onPrefixToggle={togglePrefixEnabled}
                  onSuffixToggle={toggleSuffixEnabled}
                />
              </>
            )}

            {/* Import More */}
            {state.contacts.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{i18n.importMore}</CardTitle>
                </CardHeader>
                <CardContent>
                  <VcfImporter onImport={handleImport} />
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Prefix/Suffix Tab */}
          <TabsContent value="prefixsuffix" className="space-y-6">
            <PrefixSuffixManager
              prefixList={state.prefixList}
              suffixList={state.suffixList}
              onPrefixChange={handlePrefixChange}
              onSuffixChange={handleSuffixChange}
            />
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  {i18n.settingsTitle}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Separator Settings */}
                <div className="space-y-4">
                  <h3 className="font-semibold">{i18n.settingsSeparators}</h3>

                  <div className="space-y-2">
                    <Label htmlFor="prefix-sep">{i18n.settingsPrefixSeparator}</Label>
                    <Input
                      id="prefix-sep"
                      value={prefixSeparator}
                      onChange={(e) => setPrefixSeparator(e.target.value)}
                      placeholder="공백"
                      maxLength={5}
                    />
                    <p className="text-xs text-muted-foreground">
                      예: "Dr." + " " + "John" = "Dr. John"
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="suffix-sep">{i18n.settingsSuffixSeparator}</Label>
                    <Input
                      id="suffix-sep"
                      value={suffixSeparator}
                      onChange={(e) => setSuffixSeparator(e.target.value)}
                      placeholder="공백"
                      maxLength={5}
                    />
                    <p className="text-xs text-muted-foreground">
                      예: "John" + " " + "Jr." = "John Jr."
                    </p>
                  </div>

                  <Button onClick={handleSettingsUpdate} variant="outline">
                    {i18n.settingsSave}
                  </Button>
                </div>

                {/* Options */}
                <div className="space-y-4 border-t pt-4">
                  <h3 className="font-semibold">{i18n.settingsOptions}</h3>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="prevent-dup">{i18n.settingsPreventDuplicates}</Label>
                    <Switch
                      id="prevent-dup"
                      checked={state.settings.preventDuplicates}
                      onCheckedChange={(checked) => {
                        updateState({
                          settings: {
                            ...state.settings,
                            preventDuplicates: checked,
                          },
                        });
                      }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {i18n.settingsPreventDuplicatesDesc}
                  </p>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="apply-n-field">{i18n.settingsApplyToNField}</Label>
                    <Switch
                      id="apply-n-field"
                      checked={state.settings.applyToNField}
                      onCheckedChange={(checked) => {
                        updateState({
                          settings: {
                            ...state.settings,
                            applyToNField: checked,
                          },
                        });
                      }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {i18n.settingsApplyToNFieldDesc}
                  </p>
                </div>

                {/* Danger Zone */}
                <div className="space-y-4 border-t pt-4">
                  <h3 className="font-semibold text-destructive">{i18n.settingsDangerZone}</h3>
                  <Button
                    variant="destructive"
                    onClick={() => setConfirmOpen(true)}
                    className="w-full"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    {i18n.settingsClearAll}
                  </Button>
                  <p className="text-xs text-muted-foreground">{i18n.settingsClearAllDesc}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Export Tab */}
          <TabsContent value="export" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{i18n.exportTitle}</CardTitle>
                <CardDescription>{i18n.exportDescription}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="font-medium">
                    {i18n.exportTotalContacts}: {state.contacts.length}
                  </p>
                </div>
                <ExportButton contacts={state.contacts} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Confirm Modal */}
      <ConfirmModal
        open={confirmOpen}
        title={i18n.confirmClearAll}
        description={i18n.confirmClearAllDesc}
        confirmText={i18n.confirmClearAllButton}
        cancelText={i18n.confirmCancel}
        isDangerous
        onConfirm={handleReset}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}
